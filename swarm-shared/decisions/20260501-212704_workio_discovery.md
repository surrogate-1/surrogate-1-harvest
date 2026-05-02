# workio / discovery

### Comprehensive Solution: Enhancing Workio's LINE Messaging API Integration and Discovery Capabilities

#### 1. **Diagnosis**

The Workio project faces two primary challenges:

1.  **LINE Messaging API Integration**: The current implementation lacks comprehensive error handling and logging mechanisms, making it challenging to diagnose issues related to clock-in, leave, and OT requests.
2.  **Discovery Capabilities**: The project lacks a robust search functionality, clear documentation on using the LINE Messaging API for discovery-related tasks, and a seamless discovery experience for employees.

#### 2. **Proposed Change**

To address these challenges, we propose a two-fold solution:

1.  **Enhance LINE Messaging API Integration**:
    *   Modify the `server/src/controllers/lineController.ts` file to include better error handling and logging mechanisms.
    *   Update the `server/src/services/lineService.ts` file to handle cases where the LINE API returns errors or exceptions.
2.  **Enhance Discovery Capabilities**:
    *   Introduce a robust search functionality in the dashboard.
    *   Improve the LIFF clock-in feature by introducing filtering and sorting options for employees.
    *   Develop a discovery-focused API endpoint that provides real-time insights into employee activity, leave/OT requests, and other key metrics.

#### 3. **Implementation**

The implementation will involve the following steps:

**Step 1: Enhance LINE Messaging API Integration**

*   Modify the `lineController.ts` file to include better error handling and logging mechanisms:
    ```typescript
// server/src/controllers/lineController.ts
import { Request, Response } from 'express';
import { lineService } from '../services/lineService';

const lineController = {
  async handleWebhook(req: Request, res: Response) {
    try {
      const events = req.body.events;
      // Handle each event
      events.forEach((event) => {
        if (event.type === 'message') {
          // Handle message event
          lineService.handleMessageEvent(event);
        } else if (event.type === 'follow') {
          // Handle follow event
          lineService.handleFollowEvent(event);
        }
      });
      res.status(200).send('Webhook handled successfully');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Error handling webhook');
    }
  },
};

export default lineController;
```
*   Update the `lineService.ts` file to handle cases where the LINE API returns errors or exceptions:
    ```typescript
// server/src/services/lineService.ts
import { Client } from '@line/bot-sdk';

const lineService = {
  async handleMessageEvent(event) {
    try {
      const client = new Client({
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
      });
      // Handle message event
      const message = event.message;
      if (message.type === 'text') {
        // Handle text message
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'Hello, world!',
        });
      }
    } catch (error) {
      console.error('Error handling message event:', error);
    }
  },
  async handleFollowEvent(event) {
    try {
      const client = new Client({
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
      });
      // Handle follow event
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'Thank you for following us!',
      });
    } catch (error) {
      console.error('Error handling follow event:', error);
    }
  },
};

export default lineService;
```

**Step 2: Enhance Discovery Capabilities**

*   Introduce a robust search functionality in the dashboard:
    ```typescript
// server/src/controllers/employee.controller.ts
import { Request, Response } from 'express';

const searchEmployees = async (req: Request, res: Response) => {
  const query = req.query.q;
  const employees = await Employee.find({ name: { $regex: query, $options: 'i' } });
  res.json(employees);
};
```
*   Improve the LIFF clock-in feature by introducing filtering and sorting options for employees:
    ```typescript
// client/src/components/LiffClockIn.tsx
import React, { useState } from 'react';

const LiffClockIn = () => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <div>
      <select value={filter} onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>
      <select value={sort} onChange={handleSortChange}>
        <option value="name">Name</option>
        <option value="clockInTime">Clock-in Time</option>
      </select>
      {/* Clock-in logic */}
    </div>
  );
};
```
*   Develop a discovery-focused API endpoint that provides real-time insights into employee activity, leave/OT requests, and other key metrics:
    ```typescript
// server/src/controllers/discovery.controller.ts
import { Request, Response } from 'express';

const getDiscoveryData = async (req: Request, res: Response) => {
  const employeeActivity = await EmployeeActivity.find();
  const leaveRequests = await LeaveRequest.find();
  const otRequests = await OtRequest.find();
  const data = { employeeActivity, leaveRequests, otRequests };
  res.json(data);
};
```

#### 4. **Verification**

To verify that the changes work as expected, follow these steps:

1.  Start the server by running `npm run dev` in the `server` directory.
2.  Use a tool like Postman or cURL to send a request to the webhook URL (`https://your-domain.com/webhook/line`) with a sample event payload.
3.  Verify that the server handles the event correctly and returns a successful response.
4.  Check the logs to ensure that any errors or exceptions are properly logged and handled.
5.  Test the LINE Messaging API integration by sending messages and following the account, and verify that the server handles these events correctly.
6.  Test the search functionality in the dashboard by searching for employees, leave/OT requests, and other relevant information.
7.  Verify that the LIFF clock-in feature works as expected with filtering and sorting options.
8.  Test the discovery-focused API endpoint by sending a request to the `/discovery` endpoint and verifying that the response contains the expected data.
