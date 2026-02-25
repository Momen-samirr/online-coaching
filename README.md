# Online Coaching Platform

A production-ready coaching platform with booking, payments (Paymob), blog, testimonials, and admin dashboard.

## Tech stack

- **Next.js 15** (App Router), **Prisma**, **PostgreSQL**, **Clerk** (auth), **next-intl** (en/ar), **Paymob** (payments).

## Development

```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL, Clerk keys, ADMIN_EMAIL, and optional Paymob keys
npx prisma generate
npx prisma migrate dev   # or npx prisma db push for dev
npm run dev
```

## Production / Deployment

1. **Environment variables**  
   Set all variables from `.env.example` in your hosting (Vercel, Node, etc.):
   - `DATABASE_URL` – PostgreSQL connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   - `ADMIN_EMAIL` – email allowed to access `/admin`
   - Paymob: `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_HMAC_SECRET`, `PAYMOB_IFRAME_ID`
   - Optional: `NEXT_PUBLIC_APP_URL` for webhooks/redirects (e.g. `https://your-domain.com`)

2. **Database**  
   - Run `npx prisma generate` before build.
   - Run `npx prisma migrate deploy` (or `db push` only for prototyping) against the production DB.

3. **Build and start**  
   - `npm run build`
   - `npm start`

4. **Paymob webhook**  
   In the Paymob dashboard, set the callback URL to:
   `https://<your-domain>/api/webhooks/paymob`

## Project structure

- `src/app/[locale]/` – locale-aware pages (home, dashboard, book, blog, admin)
- `src/lib/actions/` – server actions (plans, bookings, payments, blog, testimonials, settings, users)
- `src/lib/validations/` – Zod schemas
- `src/components/` – UI and admin components
