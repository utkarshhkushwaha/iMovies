
# iMovies

A JavaScript-only MERN movie booking starter with a cinematic dark UI, MongoDB persistence, cookie-based authentication, movie discovery, showtimes, seat holds, bookings, watchlists, reviews, and basic admin endpoints.

> **Status:** Development starter / MVP. This is not a launched production service. Production payment processing, email delivery, domain/HTTPS, legal review, and full end-to-end testing require your own provider accounts and verification.

## Requirements
- Node.js 20 or newer and npm
- MongoDB local instance or MongoDB Atlas database
- Optional TMDB API key for movie artwork/data
- Optional Razorpay test credentials for real provider checkout integration (not enabled by default)

Check versions:
```bash
node --version
npm --version
```

## 1. Configure the backend
Open a terminal in `iMovies/server`:
```bash
npm install
```
Copy `.env.example` to `.env` and update values:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: long random secret (at least 32 characters)
- `CLIENT_ORIGIN`: usually `http://localhost:5173`
- `TMDB_API_KEY`: optional; movie catalog can also use seeded sample records
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: optional; checkout is not treated as paid unless a provider flow is configured and verified

Seed sample movie records (clearly identified as demo catalog data):
```bash
npm run seed
```
Start backend:
```bash
npm run dev
```
API health check: http://localhost:5000/api/health

## 2. Configure the frontend
Open another terminal in `iMovies/client`:
```bash
npm install
```
Copy `.env.example` to `.env`. Default API base URL is `http://localhost:5000/api`.
Start frontend:
```bash
npm run dev
```
Open http://localhost:5173

## Windows PowerShell environment-file copy
From the project root:
```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```
On Linux/macOS:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

## Demo workflow
1. Seed the database.
2. Register a new account in the UI.
3. For admin access, create an account normally, then promote its MongoDB user document's `role` to `admin` manually in a trusted database admin tool. Never expose an open public admin-registration endpoint.
4. Browse a movie and its available showtimes.
5. Select seats and create a booking. Seat holds and booking status are persisted in MongoDB.
6. The app does not pretend to complete real payments. Configure a real payment provider integration and test webhooks before accepting money.

## Environment variables
See `server/.env.example` and `client/.env.example`. Do not commit `.env` files or production secrets.

## Important implementation notes
- Authentication uses an HTTP-only cookie. In production, configure HTTPS, secure cookies, an appropriate same-site policy, and CSRF protection for your deployment topology.
- The booking flow includes server-side seat validation and temporary holds. For a high-traffic production release, strengthen concurrency guarantees with MongoDB transactions/replica-set deployment, dedicated hold expiry jobs, idempotent payment webhooks, and load tests.
- Movie records seeded by `npm run seed` are demo records, not verified current showtimes or real theaters.
- Reviews come from users; no fake reviews or customer metrics are seeded.
- The privacy policy and terms pages are starter templates. Review them with qualified counsel and replace placeholders with your actual data practices, cancellation policy, business identity, and jurisdiction before launch.
- The favicon is included. A custom domain is not configured by this ZIP.
- Email/SMS delivery is not enabled without provider configuration.
- Run `npm test` in the server directory for the included API smoke/unit tests. Manually verify full booking and payment flows before deployment.

## Production launch checklist
- [ ] Custom domain connected and DNS verified
- [ ] HTTPS configured
- [ ] Favicon verified in deployed browser tab
- [ ] Privacy policy and terms reviewed and published
- [ ] Production MongoDB backups and access controls configured
- [ ] Real payment provider, signature verification, webhooks, and refunds tested
- [ ] Email delivery configured and verified
- [ ] CSRF protection and production cookie settings reviewed
- [ ] Authentication, authorization, booking concurrency, and failure paths tested
- [ ] Production build and accessibility checks pass
- [ ] Secrets and logs reviewed
