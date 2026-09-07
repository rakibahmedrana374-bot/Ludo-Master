# LudoArena Backend

Node.js + Express + PostgreSQL backend starter for the LudoArena frontend.

## Local
1. Install Node.js.
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Set DATABASE_URL and JWT_SECRET.
5. Run `npm start`

## Main APIs
POST /api/register
POST /api/login
GET /api/profile (Bearer token)
POST /api/transaction (Bearer token)
GET /api/tournaments

## Railway
Push this folder to GitHub and deploy the repository on Railway.
Add a PostgreSQL service and set DATABASE_URL to the PostgreSQL connection variable.
Set JWT_SECRET in Variables.
Generate a public domain from the service Networking settings.

This is a starter backend. Admin approval, withdrawal processing, payment verification,
rate limiting, email/SMS OTP, and production security should be added before real-money use.
