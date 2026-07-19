# Reservation frontend app — design

**Date:** 2026-07-19
**Status:** Approved (design)
**Author:** Hugo Seabra (with Claude)

## Goal

Add a new frontend SaaS-dashboard app, `apps/reservation`, that wires to the
existing NestJS reservation API (`backend/apps/reservation`). It provides a CRUD
for **hotels** and, nested under each hotel, a CRUD for **rooms**. It reuses the
monorepo design system and Shell pattern (as in `apps/web`) but is built from
scratch and scoped to hotels + rooms — no auth login, no org/RBAC, no next-intl.
UI labels are in English (static strings).

## Backend API (already exists — not modified)

NestJS + MikroORM, runs on `PORT` (default `3000`). Auth: every route except
`GET /health` requires an `Authorization: Token <token>` header matching
`RESERVATION_API_TOKEN`.

| Method | Path                         | Body                            | Returns                  |
| ------ | ---------------------------- | ------------------------------- | ------------------------ |
| GET    | `/hotels`                    | —                               | `Hotel[]`                |
| POST   | `/hotels`                    | `{ name, address? }`            | `Hotel` (201)            |
| GET    | `/hotels/:id`                | —                               | `Hotel` (404 if missing) |
| PATCH  | `/hotels/:id`                | `{ name?, address? }`           | `Hotel`                  |
| DELETE | `/hotels/:id`                | —                               | 204                      |
| GET    | `/hotels/:hotelId/rooms`     | —                               | `Room[]`                 |
| POST   | `/hotels/:hotelId/rooms`     | `{ number, type?, capacity? }`  | `Room` (201)             |
| GET    | `/hotels/:hotelId/rooms/:id` | —                               | `Room`                   |
| PATCH  | `/hotels/:hotelId/rooms/:id` | `{ number?, type?, capacity? }` | `Room`                   |
| DELETE | `/hotels/:hotelId/rooms/:id` | —                               | 204                      |

Entities (extend a `BaseEntity` → `id: string (uuid)`, `createdAt`, `updatedAt`):

- **Hotel**: `name: string`, `address?: string`, `rooms: Room[]`.
- **Room**: `number: string`, `type?: string`, `capacity?: number`, `hotel`.
  Unique constraint on `(hotel, number)` → creating a duplicate room number in a
  hotel returns a DB conflict (surface as 409 "room number already exists").

## Architecture

New Next.js 15 App Router app at `apps/reservation`, package name `reservation`,
sibling to `web`/`landing`/`site`. Same stack as `web`: `@repo/design-system`
(facade over antd v5), `@repo/brand-tokens`, `@repo/icons`, `@repo/utils`.

Deliberately **excluded** to keep the sample lean: `next-auth` (no login),
org/RBAC, `next-intl` (static English labels; a fixed antd locale is passed to
`ThemeProvider`).

Dev port **3100** (backend defaults to 3000, `web` uses 3000).

### Layers

1. **`src/lib/api.ts`** — `import 'server-only'` typed fetch client. Reads
   `RESERVATION_API_URL` and `RESERVATION_API_TOKEN` from server env and sets
   `Authorization: Token <token>` on every request. Functions map 1:1 to the API:
   `listHotels`, `getHotel`, `createHotel`, `updateHotel`, `deleteHotel`,
   `listRooms`, `createRoom`, `updateRoom`, `deleteRoom`. Throws a typed
   `ApiError { status: number; message: string }`, mapping:
   - 401 → "Invalid API token"
   - 404 → not found (page-level → `notFound()`)
   - 409 → "Room number already exists in this hotel"
   - other non-2xx → generic message with status.
     Missing env at call time → clear thrown error.
2. **`src/lib/types.ts`** — `Hotel`, `Room`, and `CreateHotelInput` /
   `UpdateHotelInput` / `CreateRoomInput` / `UpdateRoomInput` mirroring the DTOs.
3. **Server actions** (`actions.ts` per route) — call the api client, then
   `revalidatePath(...)`. All mutations run here (token stays server-side); this
   mirrors `apps/web/src/app/[org]/actions.ts`.
4. **RSC pages** fetch data server-side and pass it to `'use client'` **view**
   components (mirrors `web`'s `projects-view.tsx`).

The API token never reaches the browser: reads go through RSC, writes through
server actions.

## Routes & UI

- **`/`** → `redirect('/hotels')`.
- **`/hotels`** — RSC calls `listHotels()` → `HotelsView` (client):
  - `PageHeader` "Hotels" + "New hotel" button.
  - `DataTable<Hotel>`: columns name, address, actions. Row action "Rooms"
    links to `/hotels/[id]/rooms`; edit + `Popconfirm` delete. (No room-count
    column — `GET /hotels` does not include it and we avoid N extra requests.)
  - `FormModal` create/edit with fields name (required) + address (optional).
- **`/hotels/[hotelId]/rooms`** — RSC calls `getHotel(hotelId)` (→ `notFound()`
  on 404) + `listRooms(hotelId)` → `RoomsView` (client):
  - `PageHeader` with the hotel name, a back link to `/hotels`, "New room".
  - `DataTable<Room>`: columns number, type, capacity, actions (edit + delete).
  - `FormDrawer` create/edit: number (required), type (optional), capacity
    (optional positive integer). A 409 on save surfaces the "number already
    exists" message.

## Shell & layout

- **`src/components/shell/Shell.tsx`** (simplified from `web`): `AppShell` with
  - header = `ProductBranding "Reservation"` + `ThemeToggle`,
  - sidebar = `Menu` (mode `inline`) with one item **Hotels** → `/hotels`.
- **`app/layout.tsx`**: `AntdRegistry` + `Providers` (ThemeProvider seeded from a
  `theme` cookie for no light→dark flash, same approach as `web`), brand CSS.
- **`app/(dashboard)/layout.tsx`**: wraps children in `Shell`. Hotels and rooms
  routes live under this segment.

`ProductBranding` and `ThemeToggle` shapes come from `web`; `ThemeToggle` is
copied into this app (small, app-local, like `web`) rather than shared.

## Error handling

- API client throws `ApiError`; server actions re-throw; client views catch and
  call `App.useApp().message.error(err.message)`.
- Hotel 404 in a page → `notFound()` (Next 404 page).
- Missing/invalid env → thrown error with actionable text.

## Testing

- **`src/lib/api.test.ts`** (Vitest): mocked `fetch`. Asserts the auth header is
  set, request URLs/methods/bodies are correct, and error mapping (401 → invalid
  token, 404, 409 → duplicate). Uses the repo's `@repo/test-config` like `web`.
- **`src/app/(dashboard)/hotels/hotels-view.test.tsx`**: testing-library render —
  table shows seeded hotel rows and the "New hotel" modal opens on click.
- Playwright e2e is out of scope for this sample (can be added later, `web` has
  the pattern).

## Registration & running

- `package.json` — name `reservation`, `private: true`, `type: module`, scripts:
  `dev: next dev -p 3100`, `build`, `start`, `lint`, `typecheck`, `test`,
  `test:coverage`, `clean`. Dependencies mirror `web` minus auth/intl.
- `next.config.ts` — `reactStrictMode` + `transpilePackages` for the `@repo/*`
  libs (no `next-intl` plugin).
- `tsconfig.json` (extends `@repo/typescript-config/nextjs.json`, `@/*` paths),
  `eslint.config.js` (from `@repo/eslint-config`), `next-env.d.ts`.
- `apps/*` is already in `pnpm-workspace.yaml` and turbo/nx `*` — no extra wiring.
- **`.env.example`**: `RESERVATION_API_URL=http://localhost:3000`,
  `RESERVATION_API_TOKEN=dev-token`.
- **README.md**: start the backend (`backend/apps/reservation` with a known
  `RESERVATION_API_TOKEN`), set the same token in this app's `.env`, then
  `pnpm --filter reservation dev` → `http://localhost:3100`.

## Out of scope

- Modifying the backend.
- Authentication/login, multi-tenant orgs, RBAC.
- Internationalization (next-intl) and language switching.
- Reservations/bookings themselves — only hotels and rooms CRUD.
- Playwright e2e.
