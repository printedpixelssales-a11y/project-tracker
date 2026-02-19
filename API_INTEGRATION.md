# OpenClaw Session Integration Guide

The `/api/agents` endpoint is designed to fetch real-time agent activity from OpenClaw sessions.

## Current Implementation

The API route currently uses **mock data** that simulates the real structure. To integrate with actual OpenClaw sessions, you need to:

1. **Connect the OpenClaw gateway** (already running on Rodger)
2. **Call sessions_list()** to get active sessions
3. **Process session history** to extract current work

## Integration Steps

### Step 1: Get Gateway URL & Token

OpenClaw gateway runs locally. You need:
- **Gateway URL:** `http://localhost:3001` (or your configured port)
- **Gateway Token:** Set in your OpenClaw config

### Step 2: Update the API Route

Replace the mock data section in `app/api/agents/route.ts`:

```typescript
// Instead of mock data, use real sessions
const response = await fetch(`${GATEWAY_URL}/sessions/list`, {
  headers: {
    'Authorization': `Bearer ${GATEWAY_TOKEN}`
  }
});

const { sessions } = await response.json();

// Then transform sessions as shown in the current implementation
```

### Step 3: Environment Variables

Add to `.env.local`:

```
OPENCLAW_GATEWAY_URL=http://localhost:3001
OPENCLAW_GATEWAY_TOKEN=your-token-here
```

Then update the API route to use:

```typescript
const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
```

## What the API Returns

```json
{
  "agents": [
    {
      "id": "cipher",
      "name": "Cipher (You)",
      "status": "working",
      "currentActivity": "Building project tracker",
      "lastUpdated": "2026-02-15T12:05:00Z",
      "sessionKey": "main",
      "recentWork": [
        "Deployed 99nightsguide.com",
        "Created dashboard",
        "Integrated session data"
      ]
    }
  ],
  "lastUpdated": "2026-02-15T12:05:00Z",
  "timestamp": 1708018800000,
  "source": "openclaw-sessions"
}
```

## Status Determination

- **Working:** Last message within 5 minutes
- **Idle:** Last message 5-60 minutes ago
- **Offline:** Last message >60 minutes ago

## Testing

1. **Local:** Run `npm run dev` and visit `/api/agents`
2. **Production:** Visit https://project-tracker-vert-six.vercel.app/api/agents

## Future Enhancements

- **Polling interval:** Currently every 10 seconds in the dashboard
- **Session filtering:** Filter by agent type, project, or priority
- **Activity details:** Extract more granular work details from message history
- **Notifications:** Alert on blockers or status changes
- **History:** Store activity logs for analytics

## Notes

- The gateway must be accessible from Vercel for production deployments
- Consider adding rate limiting to avoid excessive API calls
- Session data is only as recent as the last message timestamp
- Mock fallback ensures tracker doesn't break if gateway is unavailable
