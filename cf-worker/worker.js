// surrogate-1-cursor — multi-purpose CF Worker
//
// Handlers:
//   fetch()      — HTTP API (cursor service, datasets, audit, metrics, dashboard)
//   scheduled()  — runs every 5 min via cron trigger:
//                  pings 6 HF Spaces /health, writes status to D1 space_health
//   queue()      — consumes surrogate-1-tasks (3rd queue backend, round-robin)
//
// Bindings: env.DB (D1), env.CACHE (KV), env.AUTH_TOKEN, env.TASKS_QUEUE (producer)
//
// Roadmap features in this version:
//   #1   cursor exhaustion + total tracking
//   #2   Worker auth (shared secret on writes/audit)
//   #9   audit log
//   #15  external health pinger (cron + HF Space pings)
//   #21  /metrics (Prom format)
//   #22  per-dataset dashboard (basic HTML at /dash)
//   CF-#A  Workers AI (callable from /ai/<model> for testing)
//   CF-#C  Queue consumer (push from anywhere via env.TASKS_QUEUE.send())

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Token",
};

const SPACES = [
  "axentx/surrogate-1",
  "surrogate1/surrogate-1-shard2",
  "surrogate1/surrogate-1-zero-gpu",
  "ashirafuse1/surrogate-1-shard3",
  "ashirato/surrogate-1-zero-gpu",
  "ashirato/surrogate-1-shard1",
];

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });

function authed(request, env) {
  const want = (env.AUTH_TOKEN || "").trim();
  if (!want) return true;
  const got = (
    request.headers.get("X-Auth-Token") ||
    (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "")
  ).trim();
  return got && got === want;
}

async function audit(env, ctx, action, slug, meta) {
  ctx.waitUntil(
    env.DB.prepare(
      "INSERT INTO audit_log (action, dataset_id, meta, ts) VALUES (?1, ?2, ?3, unixepoch())"
    )
      .bind(action, slug || null, JSON.stringify(meta || {}).slice(0, 2000))
      .run()
      .catch(() => {})
  );
}

async function bumpMetric(env, ctx, key) {
  ctx.waitUntil(
    env.DB.prepare(
      "INSERT INTO metrics (key, n) VALUES (?1, 1) ON CONFLICT(key) DO UPDATE SET n = n + 1"
    ).bind(key).run().catch(() => {})
  );
}

// ── Dashboard HTML (server-rendered, no JS framework) ──────────────────────
function renderDashboard(stats, datasets, spaces, audit) {
  return `<!doctype html><html><head>
<meta charset="utf-8"><title>surrogate-1 dashboard</title>
<style>
  body{font:14px/1.5 system-ui,Arial;margin:24px;color:#222;max-width:1200px}
  h1{margin:0 0 8px}h2{margin:24px 0 6px;font-size:15px;color:#666}
  table{border-collapse:collapse;width:100%;margin:6px 0 18px}
  td,th{border-bottom:1px solid #eee;padding:5px 8px;text-align:left;font-size:13px}
  th{background:#fafafa;font-weight:600}
  .ok{color:#080}.bad{color:#c00}.muted{color:#888}
  .b{font-weight:600}.r{text-align:right;font-variant-numeric:tabular-nums}
</style></head><body>
<h1>surrogate-1 dashboard</h1>
<div class="muted">live state · ${new Date().toISOString()}</div>

<h2>HF Spaces (last cron probe)</h2>
<table><tr><th>Space</th><th>Status</th><th class="r">Latency</th><th class="r">Last seen</th></tr>
${spaces.map(s => `<tr>
  <td>${s.space_id}</td>
  <td class="${s.http_code >= 200 && s.http_code < 400 ? 'ok' : 'bad'}">${s.http_code || '?'}</td>
  <td class="r">${s.latency_ms || '?'}ms</td>
  <td class="r">${s.ts ? new Date(s.ts*1000).toISOString().slice(11,19) : '?'}</td>
</tr>`).join('')}
</table>

<h2>Datasets registry (${datasets.length})</h2>
<table><tr><th>Score</th><th>Slug</th><th>HF ID</th><th class="r">Cap</th></tr>
${datasets.slice(0, 25).map(d => `<tr>
  <td>${d.score?.toFixed(2)}</td>
  <td class="b">${d.slug}</td>
  <td>${d.id}</td>
  <td class="r">${d.cap?.toLocaleString()}</td>
</tr>`).join('')}
</table>

<h2>Counters</h2>
<table>${Object.entries(stats).map(([k,v]) => `<tr><td>${k}</td><td class="r b">${v.toLocaleString()}</td></tr>`).join('')}</table>

<h2>Recent audit (last 20)</h2>
<table><tr><th>When</th><th>Action</th><th>Subject</th><th>Meta</th></tr>
${audit.slice(0, 20).map(a => `<tr>
  <td class="muted">${new Date(a.ts*1000).toISOString().slice(11,19)}</td>
  <td>${a.action}</td>
  <td>${a.dataset_id || ''}</td>
  <td class="muted">${(a.meta || '').slice(0, 80)}</td>
</tr>`).join('')}
</table>
</body></html>`;
}

export default {
  // ── HTTP handler ─────────────────────────────────────────────────────────
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const path = url.pathname;
    const t0 = Date.now();

    try {
      if (path === "/health" || path === "/") {
        await bumpMetric(env, ctx, "req:health");
        return json({ status: "ok", service: "surrogate-1-cursor", ts: Date.now() });
      }

      if (path === "/dynamic-datasets" && request.method === "GET") {
        await bumpMetric(env, ctx, "req:datasets");
        const cached = await env.CACHE.get("datasets:all", { type: "json" });
        if (cached) return json(cached);
        const r = await env.DB.prepare(
          "SELECT slug, hf_id AS id, schema, license, cap, score, downloads, discovered_ts FROM datasets ORDER BY score DESC LIMIT 5000"
        ).all();
        const list = r.results || [];
        ctx.waitUntil(env.CACHE.put("datasets:all", JSON.stringify(list), { expirationTtl: 60 }));
        return json(list);
      }

      if (path === "/metrics" && request.method === "GET") {
        const r = await env.DB.prepare("SELECT key, n FROM metrics ORDER BY key").all();
        const lines = [
          "# HELP surrogate_cursor_requests Total requests by endpoint",
          "# TYPE surrogate_cursor_requests counter",
        ];
        for (const m of (r.results || [])) {
          lines.push(`surrogate_cursor_requests{key="${m.key}"} ${m.n}`);
        }
        return new Response(lines.join("\n") + "\n", {
          headers: { "Content-Type": "text/plain; version=0.0.4", ...CORS },
        });
      }

      // /dash — HTML dashboard
      if (path === "/dash" && request.method === "GET") {
        const [m, d, s, a] = await Promise.all([
          env.DB.prepare("SELECT key, n FROM metrics").all(),
          env.DB.prepare("SELECT slug, hf_id AS id, score, cap FROM datasets ORDER BY score DESC LIMIT 50").all(),
          env.DB.prepare("SELECT space_id, http_code, latency_ms, ts FROM space_health ORDER BY ts DESC LIMIT 6").all().catch(() => ({ results: [] })),
          env.DB.prepare("SELECT action, dataset_id, meta, ts FROM audit_log ORDER BY id DESC LIMIT 20").all(),
        ]);
        const stats = Object.fromEntries((m.results || []).map(x => [x.key, x.n]));
        return new Response(
          renderDashboard(stats, d.results || [], s.results || [], a.results || []),
          { headers: { "Content-Type": "text/html; charset=utf-8", ...CORS } }
        );
      }

      // /ai/<model> — proxy to Workers AI (handy for ad-hoc tests + 12th LLM provider)
      const aiMatch = path.match(/^\/ai\/(.+)$/);
      if (aiMatch && request.method === "POST") {
        if (!authed(request, env)) return json({ error: "auth required" }, 401);
        const model = "@cf/" + decodeURIComponent(aiMatch[1]);
        const body = await request.json().catch(() => ({}));
        const result = await env.AI.run(model, {
          messages: body.messages || [{ role: "user", content: body.prompt || "" }],
          max_tokens: body.max_tokens || 512,
        });
        await bumpMetric(env, ctx, `ai:${model}`);
        return json(result);
      }

      // /tasks/push — enqueue into CF Queue (3rd queue backend)
      if (path === "/tasks/push" && request.method === "POST") {
        if (!authed(request, env)) return json({ error: "auth required" }, 401);
        const body = await request.json().catch(() => ({}));
        await env.TASKS_QUEUE.send(body);
        await bumpMetric(env, ctx, "queue:push");
        return json({ ok: true });
      }

      // Cursor routes
      const m = path.match(/^\/cursor\/([^\/]+)(\/advance)?\/?$/);
      if (m) {
        const slug = decodeURIComponent(m[1]);
        const isAdvance = !!m[2] && request.method === "POST";

        if (isAdvance) {
          if (!authed(request, env)) return json({ error: "auth required" }, 401);
          const b = await request.json().catch(() => ({}));
          const size = Math.max(1, Math.min(100000, parseInt(b.size || 1000)));
          const last = (b.last_batch || "").slice(0, 200);
          const total = b.total != null ? parseInt(b.total) : null;
          const exhausted = b.exhausted ? 1 : 0;
          const cur = await env.DB.prepare(
            "INSERT INTO cursors (dataset_id, offset, total, last_batch, exhausted) " +
            "VALUES (?1, ?2, ?3, ?4, ?5) " +
            "ON CONFLICT(dataset_id) DO UPDATE SET " +
            "  offset = offset + ?2, total = COALESCE(?3, total), last_batch = ?4, " +
            "  exhausted = MAX(exhausted, ?5), updated_at = unixepoch() " +
            "RETURNING dataset_id, offset, total, last_batch, exhausted, updated_at"
          ).bind(slug, size, total, last, exhausted).first();
          if (cur && cur.total != null && cur.offset >= cur.total && !cur.exhausted) {
            await env.DB.prepare("UPDATE cursors SET exhausted=1 WHERE dataset_id=?")
              .bind(slug).run();
            cur.exhausted = 1;
          }
          await bumpMetric(env, ctx, "req:advance");
          await audit(env, ctx, "advance", slug, { size, total, exhausted: cur?.exhausted });
          return json(cur);
        }

        await bumpMetric(env, ctx, "req:cursor_read");
        let cur = await env.DB.prepare(
          "SELECT dataset_id, offset, total, last_batch, exhausted, updated_at FROM cursors WHERE dataset_id = ?"
        ).bind(slug).first();
        if (!cur) cur = { dataset_id: slug, offset: 0, total: null, last_batch: null, exhausted: 0, updated_at: null };
        return json(cur);
      }

      if (path === "/datasets" && request.method === "POST") {
        if (!authed(request, env)) return json({ error: "auth required" }, 401);
        const b = await request.json().catch(() => ({}));
        if (!b.slug || !b.hf_id) return json({ error: "slug and hf_id required" }, 400);
        await env.DB.prepare(
          "INSERT INTO datasets (slug, hf_id, schema, license, cap, score) VALUES (?1,?2,?3,?4,?5,?6) " +
          "ON CONFLICT(slug) DO UPDATE SET hf_id=excluded.hf_id, schema=excluded.schema, license=excluded.license, cap=excluded.cap, score=excluded.score"
        ).bind(b.slug, b.hf_id, b.schema || "messages", b.license || null, b.cap || 50000, b.score || 0.5).run();
        ctx.waitUntil(env.CACHE.delete("datasets:all"));
        await audit(env, ctx, "register", b.slug, { hf_id: b.hf_id });
        await bumpMetric(env, ctx, "req:datasets_upsert");
        return json({ ok: true, slug: b.slug });
      }

      if (path === "/audit" && request.method === "GET") {
        if (!authed(request, env)) return json({ error: "auth required" }, 401);
        const limit = Math.min(500, parseInt(url.searchParams.get("limit") || "100"));
        const since = parseInt(url.searchParams.get("since") || "0");
        const r = await env.DB.prepare(
          "SELECT id, action, dataset_id, meta, ts FROM audit_log WHERE ts >= ? ORDER BY id DESC LIMIT ?"
        ).bind(since, limit).all();
        return json(r.results || []);
      }

      return json({ error: "not found", path }, 404);
    } catch (e) {
      await bumpMetric(env, ctx, "req:error");
      return json({ error: e.message, stack: (e.stack || "").split("\n")[0] }, 500);
    } finally {
      const dt = Date.now() - t0;
      ctx.waitUntil(
        env.DB.prepare(
          "INSERT INTO metrics (key, n) VALUES ('latency_ms_sum', ?) ON CONFLICT(key) DO UPDATE SET n = n + ?"
        ).bind(dt, dt).run().catch(() => {})
      );
    }
  },

  // ── Cron handler — every 5 min, ping each Space /health ─────────────────
  async scheduled(event, env, ctx) {
    const ua = "Mozilla/5.0 (compatible; SurrogateCursorWorker/1.0; +https://surrogate-1-cursor.ashira.workers.dev)";
    for (const sp of SPACES) {
      const sub = sp.replace("/", "-");
      const t0 = Date.now();
      let code = 0;
      try {
        const resp = await fetch(`https://${sub}.hf.space/health`, {
          headers: { "User-Agent": ua },
          signal: AbortSignal.timeout(15000),
        });
        code = resp.status;
      } catch (e) {
        code = 0;
      }
      const dt = Date.now() - t0;
      ctx.waitUntil(
        env.DB.prepare(
          "INSERT INTO space_health (space_id, http_code, latency_ms, ts) VALUES (?1, ?2, ?3, unixepoch())"
        ).bind(sp, code, dt).run().catch(() => {})
      );
    }
    // Trim old health rows (keep last 1000)
    ctx.waitUntil(
      env.DB.prepare(
        "DELETE FROM space_health WHERE id NOT IN (SELECT id FROM space_health ORDER BY id DESC LIMIT 1000)"
      ).run().catch(() => {})
    );
  },

  // ── Queue consumer — 3rd backend, eats from surrogate-1-tasks ───────────
  async queue(batch, env, ctx) {
    for (const msg of batch.messages) {
      try {
        // Simplest behavior: log + audit. Real consumers can extend with
        // routing logic (e.g. forward to Supabase queue for execution).
        ctx.waitUntil(
          env.DB.prepare(
            "INSERT INTO audit_log (action, dataset_id, meta, ts) VALUES ('queue_consume', ?1, ?2, unixepoch())"
          ).bind(
            msg.body?.dataset_id || null,
            JSON.stringify(msg.body || {}).slice(0, 2000)
          ).run().catch(() => {})
        );
        msg.ack();
      } catch (e) {
        msg.retry();
      }
    }
  },
};
