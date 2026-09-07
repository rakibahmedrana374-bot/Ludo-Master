LudoArena New Dashboard Frontend

Connected API: https://ludo-master-v71z.onrender.com

Real features using the current backend:
- Register: POST /api/register
- Login: POST /api/login (phone + password)
- Dashboard/Profile: GET /api/profile with JWT
- Deposit request: POST /api/transaction (trx_id, amount, method)
- Tournament list: GET /api/tournaments
- API health: GET /health

Registration and login use the existing PostgreSQL backend. The JWT is stored in browser localStorage so the user stays logged in after refresh.

Important: the current backend stores deposit requests as pending; it does not automatically credit wallet balance. Tournament Join is also UI-only until a join endpoint is added to the backend.

For GitHub Pages, upload index.html to the repository root and enable Pages from the main branch/root folder.
