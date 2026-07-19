# reservation (frontend)

A sample SaaS dashboard for managing **hotels** and their **rooms**, wired to the
NestJS reservation API (`backend/apps/reservation`). Built on Next.js 15 + Ant
Design v5 via `@repo/design-system`. The API token stays server-side (RSC reads

- server-action writes); the browser never sees it.

## Prerequisites

Run the backend first. From `backend/apps/reservation`, start it with a known
token, e.g. `RESERVATION_API_TOKEN=dev-token` on `PORT=3000` (see that app's
own README for its dev command and database setup).

## Configure

```bash
cp apps/reservation/.env.example apps/reservation/.env
# then edit apps/reservation/.env so RESERVATION_API_TOKEN matches the backend
```

`.env`:

- `RESERVATION_API_URL` — backend base URL (default `http://localhost:3000`)
- `RESERVATION_API_TOKEN` — must match the backend's token

## Run

```bash
pnpm --filter reservation dev
```

Open http://localhost:3100 — it redirects to `/hotels`.

## Routes

- `/hotels` — list, create, edit, delete hotels
- `/hotels/[hotelId]/rooms` — list, create, edit, delete rooms for a hotel

## Test / lint / typecheck

```bash
pnpm --filter reservation test
pnpm --filter reservation lint
pnpm --filter reservation typecheck
```
