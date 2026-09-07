# LudoArena Backend - Account ID + Admin Block/Unblock

Keeps the existing API and adds:
- 6-digit Account ID
- `blocked` user status
- blocked users cannot login
- admin user list
- admin block/unblock endpoint

## Render Environment Variable
Add:
`ADMIN_PHONES=YOUR_ADMIN_MOBILE`
For multiple admins: `ADMIN_PHONES=017xxxxxxxx,018xxxxxxxx`

Keep your existing `DATABASE_URL` and `JWT_SECRET`. Do not commit secret values.

Admin endpoints:
- GET `/api/admin/users`
- POST `/api/admin/users/:accountId/block` with `{ "blocked": true }` or `{ "blocked": false }`
