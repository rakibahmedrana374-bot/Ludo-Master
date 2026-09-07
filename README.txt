LudoArena Auth-Only Frontend

This frontend is connected to:
https://ludo-master-v71z.onrender.com

Before login/register, the site shows ONLY Login and Register.
After successful login, the dashboard shows ONLY:
- Home
- Wallet
- Profile

Registration fields:
- Name
- Mobile number
- Exactly 6-digit numeric password
- Confirm password

Login uses mobile number + exactly 6-digit numeric password.
JWT token is stored in localStorage so refresh keeps the session.

Upload index.html to GitHub Pages. The existing Render backend must remain live.
