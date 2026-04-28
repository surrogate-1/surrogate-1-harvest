#!/usr/bin/env bash
# Parallel bulk ingest — runs 4 dataset-enrich shards concurrently.
# Each shard handles 1/4 of the DATASETS list (split by slug hash).
# Central dedup ensures no overlap. SQLite WAL mode allows concurrent writes.
#
# Usage: invoked by start.sh as continuous background daemon.
set -uo pipefail
set -a; source "$HOME/.hermes/.env" 2>/dev/null; set +a

LOG="$HOME/.surrogate/logs/bulk-ingest-parallel.log"
mkdir -p "$(dirname "$LOG")"

NUM_SHARDS="${INGEST_SHARDS:-4}"           # was 16 -> 6 -> 4. cpu-basic 16Gi
                                            # cap was breached even with 6
                                            # shards because 'datasets' lib
                                            # peaks ~1.5-2 GB during parquet
                                            # decode under load. 4 shards +
                                            # parquet-direct (2 DLs) + 30
                                            # daemons fits comfortably with
                                            # ~3 GB headroom for the watchdog
                                            # to react before OOM.
SHARD_COOLDOWN="${SHARD_COOLDOWN:-120}"     # 2 min between shard cycles

echo "[$(date +%H:%M:%S)] bulk-ingest-parallel start (shards=$NUM_SHARDS)" | tee -a "$LOG"

shard_loop() {
    local shard_id="$1"
    local total_shards="$2"
    while true; do
        echo "[$(date +%H:%M:%S)] shard-$shard_id starting iter (total_shards=$total_shards)" >> "$LOG"
        SHARD_ID="$shard_id" SHARD_TOTAL="$total_shards" \
            bash "$HOME/.surrogate/bin/dataset-enrich.sh" >> "$LOG" 2>&1
        local rc=$?
        echo "[$(date +%H:%M:%S)] shard-$shard_id done rc=$rc, sleep ${SHARD_COOLDOWN}s" >> "$LOG"
        sleep "$SHARD_COOLDOWN"
    done
}

# Stagger startup 30s apart so memory ramps up gradually — if the OOM killer
# is going to fire, give earlier shards a chance to settle into steady-state
# before all peers are loading datasets in parallel.
for i in $(seq 0 $((NUM_SHARDS - 1))); do
    shard_loop "$i" "$NUM_SHARDS" &
    sleep 30
done
wait
