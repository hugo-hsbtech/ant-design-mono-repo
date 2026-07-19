# Reservation Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new Next.js SaaS-dashboard app `apps/reservation` that provides a hotels CRUD and a nested rooms CRUD, wired to the existing NestJS reservation API with the API token kept server-side.

**Architecture:** Next.js 15 App Router app reusing `@repo/design-system` (antd v5 facade) and the Shell pattern from `apps/web`. A `server-only` typed fetch client (`src/lib/api.ts`) talks to the backend; RSC pages read data and `'use server'` actions perform mutations, so the token never reaches the browser. Static English labels, no auth/org/i18n.

**Tech Stack:** Next.js 15, React 19, antd v5 via `@repo/design-system`, TypeScript, Vitest + Testing Library.

## Global Constraints

- Package name: `reservation`; location `apps/reservation`; `private: true`, `type: module`.
- Dev port: **3100** (`next dev -p 3100`). Backend defaults to 3000.
- All UI imports come from `@repo/design-system`, never from `antd` directly.
- API token env vars: `RESERVATION_API_URL`, `RESERVATION_API_TOKEN` (server-only; never referenced in client components).
- Auth header format the backend expects: `Authorization: Token <token>`.
- UI copy is English, static strings.
- Reads use `cache: 'no-store'` (always fresh); mutations run in server actions that call `revalidatePath`.
- Backend entity JSON shape: `Hotel { id, name, address?, createdAt, updatedAt }`, `Room { id, number, type?, capacity?, createdAt, updatedAt }`; timestamps are ISO strings over the wire. Room `number` is unique per hotel (duplicate → HTTP 409).

---

## File Structure

```
apps/reservation/
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.js
├── next-env.d.ts
├── vitest.config.ts
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── test/server-only-stub.ts
    ├── lib/
    │   ├── types.ts            # Hotel, Room, Create/Update inputs
    │   ├── api.ts              # server-only fetch client + ApiError
    │   └── api.test.ts
    ├── components/
    │   ├── ThemeToggle.tsx
    │   └── shell/Shell.tsx
    └── app/
        ├── layout.tsx          # AntdRegistry + Providers + brand CSS
        ├── providers.tsx       # ThemeProvider (cookie-seeded)
        ├── page.tsx            # redirect('/hotels')
        └── (dashboard)/
            ├── layout.tsx      # wraps children in <Shell>
            └── hotels/
                ├── page.tsx            # RSC: listHotels
                ├── actions.ts          # create/update/delete hotel
                ├── hotels-view.tsx     # client table + FormModal
                ├── hotels-view.test.tsx
                └── [hotelId]/rooms/
                    ├── page.tsx        # RSC: getHotel + listRooms
                    ├── actions.ts      # create/update/delete room
                    └── rooms-view.tsx  # client table + FormDrawer
```

---

### Task 1: Types + server-only API client (with unit tests)

Foundation: the typed client every page/action calls. Folds in the minimal scaffold (package.json, tsconfig, vitest config, server-only stub) needed to run the tests. Deliverable: `pnpm --filter reservation test` passes.

**Files:**

- Create: `apps/reservation/package.json`
- Create: `apps/reservation/tsconfig.json`
- Create: `apps/reservation/eslint.config.js`
- Create: `apps/reservation/next-env.d.ts`
- Create: `apps/reservation/.gitignore`
- Create: `apps/reservation/vitest.config.ts`
- Create: `apps/reservation/src/test/server-only-stub.ts`
- Create: `apps/reservation/src/lib/types.ts`
- Create: `apps/reservation/src/lib/api.ts`
- Test: `apps/reservation/src/lib/api.test.ts`

**Interfaces:**

- Produces (consumed by all later tasks):
  - `types.ts`: `Hotel { id: string; name: string; address?: string; createdAt: string; updatedAt: string }`, `Room { id: string; number: string; type?: string; capacity?: number; createdAt: string; updatedAt: string }`, `CreateHotelInput { name: string; address?: string }`, `UpdateHotelInput = Partial<CreateHotelInput>`, `CreateRoomInput { number: string; type?: string; capacity?: number }`, `UpdateRoomInput = Partial<CreateRoomInput>`.
  - `api.ts`: `class ApiError extends Error { status: number }`, and functions `listHotels(): Promise<Hotel[]>`, `getHotel(id): Promise<Hotel>`, `createHotel(input: CreateHotelInput): Promise<Hotel>`, `updateHotel(id, input: UpdateHotelInput): Promise<Hotel>`, `deleteHotel(id): Promise<void>`, `listRooms(hotelId): Promise<Room[]>`, `createRoom(hotelId, input: CreateRoomInput): Promise<Room>`, `updateRoom(hotelId, id, input: UpdateRoomInput): Promise<Room>`, `deleteRoom(hotelId, id): Promise<void>`.

- [ ] **Step 1: Create the package scaffold files**

`apps/reservation/package.json`:

```json
{
  "name": "reservation",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3100",
    "build": "next build",
    "start": "next start -p 3100",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "clean": "rimraf .next .turbo"
  },
  "dependencies": {
    "@ant-design/icons": "^5.5.2",
    "@ant-design/nextjs-registry": "^1.0.2",
    "@repo/brand-tokens": "workspace:*",
    "@repo/design-system": "workspace:*",
    "@repo/icons": "workspace:*",
    "@repo/utils": "workspace:*",
    "antd": "^5.22.5",
    "next": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "server-only": "^0.0.1"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/test-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitest/coverage-v8": "^3.2.6",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.3",
    "rimraf": "^6.0.1",
    "typescript": "^5.7.2",
    "vitest": "^3.0.0"
  }
}
```

`apps/reservation/tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next"]
}
```

`apps/reservation/eslint.config.js`:

```js
import { reactConfig } from '@repo/eslint-config/react';

export default [
  ...reactConfig,
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
];
```

`apps/reservation/next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

`apps/reservation/.gitignore`:

```
.next/
.turbo/
coverage/
.env
*.tsbuildinfo
```

`apps/reservation/vitest.config.ts` (jsdom for the later component test; `server-only` aliased to a no-op; coverage scoped to the logic layer):

```ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { coverageConfig } from '../../packages/test-config/vitest.coverage';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../packages/test-config/vitest.setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      ...coverageConfig({ lines: 80, statements: 80, functions: 80, branches: 70 }),
      include: ['src/lib/**'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'server-only': fileURLToPath(new URL('./src/test/server-only-stub.ts', import.meta.url)),
    },
  },
});
```

`apps/reservation/src/test/server-only-stub.ts`:

```ts
// Test stub: `server-only` throws outside an RSC server graph. Vitest runs in
// plain Node, so alias the import to this no-op (see vitest.config.ts).
export {};
```

- [ ] **Step 2: Install dependencies**

Run: `pnpm install`
Expected: completes; `apps/reservation` is picked up by the `apps/*` workspace glob.

- [ ] **Step 3: Write `src/lib/types.ts`**

```ts
export interface Hotel {
  id: string;
  name: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  number: string;
  type?: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelInput {
  name: string;
  address?: string;
}
export type UpdateHotelInput = Partial<CreateHotelInput>;

export interface CreateRoomInput {
  number: string;
  type?: string;
  capacity?: number;
}
export type UpdateRoomInput = Partial<CreateRoomInput>;
```

- [ ] **Step 4: Write the failing test `src/lib/api.test.ts`**

```ts
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, listHotels, createHotel, getHotel, createRoom } from './api';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
}

beforeEach(() => {
  process.env.RESERVATION_API_URL = 'http://api.test';
  process.env.RESERVATION_API_TOKEN = 'secret-token';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api client', () => {
  it('sends the Authorization: Token header and returns the body', async () => {
    const fetchMock = mockFetch(200, [{ id: 'h1', name: 'Grand', createdAt: '', updatedAt: '' }]);
    vi.stubGlobal('fetch', fetchMock);

    const hotels = await listHotels();

    expect(hotels).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://api.test/hotels');
    expect((init.headers as Record<string, string>).Authorization).toBe('Token secret-token');
    expect(init.cache).toBe('no-store');
  });

  it('POSTs create bodies as JSON', async () => {
    const fetchMock = mockFetch(201, { id: 'h2', name: 'Plaza', createdAt: '', updatedAt: '' });
    vi.stubGlobal('fetch', fetchMock);

    await createHotel({ name: 'Plaza' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://api.test/hotels');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'Plaza' });
  });

  it('maps 401 to an invalid-token ApiError', async () => {
    vi.stubGlobal('fetch', mockFetch(401, { message: 'nope' }));
    await expect(listHotels()).rejects.toMatchObject({ status: 401, message: 'Invalid API token' });
  });

  it('maps 404 to an ApiError carrying the status', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { message: 'Hotel x not found' }));
    await expect(getHotel('x')).rejects.toBeInstanceOf(ApiError);
    await expect(getHotel('x')).rejects.toMatchObject({ status: 404 });
  });

  it('maps 409 on room create to a duplicate-number message', async () => {
    vi.stubGlobal('fetch', mockFetch(409, { message: 'duplicate' }));
    await expect(createRoom('h1', { number: '101' })).rejects.toMatchObject({
      status: 409,
      message: 'Room number already exists in this hotel',
    });
  });

  it('throws a clear error when env is missing', async () => {
    delete process.env.RESERVATION_API_URL;
    vi.stubGlobal('fetch', mockFetch(200, []));
    await expect(listHotels()).rejects.toThrow(/RESERVATION_API_URL/);
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `pnpm --filter reservation test`
Expected: FAIL — `./api` has no exports yet (cannot find module / undefined functions).

- [ ] **Step 6: Write `src/lib/api.ts`**

```ts
import 'server-only';
import type {
  CreateHotelInput,
  CreateRoomInput,
  Hotel,
  Room,
  UpdateHotelInput,
  UpdateRoomInput,
} from './types';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function config(): { baseUrl: string; token: string } {
  const baseUrl = process.env.RESERVATION_API_URL;
  const token = process.env.RESERVATION_API_TOKEN;
  if (!baseUrl || !token) {
    throw new Error(
      'RESERVATION_API_URL and RESERVATION_API_TOKEN must be set to reach the reservation API',
    );
  }
  return { baseUrl: baseUrl.replace(/\/$/, ''), token };
}

function mapError(status: number, body: unknown): string {
  if (status === 401) return 'Invalid API token';
  if (status === 409) return 'Room number already exists in this hotel';
  const message = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return `Request failed with status ${status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { baseUrl, token } = config();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
      ...init?.headers,
    },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, mapError(res.status, body));
  }
  return body as T;
}

// ── Hotels ──────────────────────────────────────────────────────────────────
export const listHotels = () => request<Hotel[]>('/hotels');
export const getHotel = (id: string) => request<Hotel>(`/hotels/${id}`);
export const createHotel = (input: CreateHotelInput) =>
  request<Hotel>('/hotels', { method: 'POST', body: JSON.stringify(input) });
export const updateHotel = (id: string, input: UpdateHotelInput) =>
  request<Hotel>(`/hotels/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
export const deleteHotel = (id: string) => request<void>(`/hotels/${id}`, { method: 'DELETE' });

// ── Rooms (nested under a hotel) ─────────────────────────────────────────────
export const listRooms = (hotelId: string) => request<Room[]>(`/hotels/${hotelId}/rooms`);
export const createRoom = (hotelId: string, input: CreateRoomInput) =>
  request<Room>(`/hotels/${hotelId}/rooms`, { method: 'POST', body: JSON.stringify(input) });
export const updateRoom = (hotelId: string, id: string, input: UpdateRoomInput) =>
  request<Room>(`/hotels/${hotelId}/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
export const deleteRoom = (hotelId: string, id: string) =>
  request<void>(`/hotels/${hotelId}/rooms/${id}`, { method: 'DELETE' });
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `pnpm --filter reservation test`
Expected: PASS (6 tests).

- [ ] **Step 8: Typecheck**

Run: `pnpm --filter reservation typecheck`
Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add apps/reservation pnpm-lock.yaml
git commit -m "feat(reservation): server-only API client + types"
```

---

### Task 2: App shell, providers, layout, and redirect

Boots the app with the design-system Shell and a placeholder hotels route. Deliverable: `pnpm --filter reservation dev` boots, `/` redirects to `/hotels`, the Shell (branding + theme toggle + Hotels menu) renders, and `next build` succeeds.

**Files:**

- Create: `apps/reservation/next.config.ts`
- Create: `apps/reservation/.env.example`
- Create: `apps/reservation/src/app/layout.tsx`
- Create: `apps/reservation/src/app/providers.tsx`
- Create: `apps/reservation/src/app/page.tsx`
- Create: `apps/reservation/src/components/ThemeToggle.tsx`
- Create: `apps/reservation/src/components/product/ProductBranding.tsx` (copied from `web`)
- Create: `apps/reservation/src/components/shell/Shell.tsx`
- Create: `apps/reservation/src/app/(dashboard)/layout.tsx`
- Create: `apps/reservation/src/app/(dashboard)/hotels/page.tsx` (temporary placeholder, replaced in Task 3)

**Interfaces:**

- Consumes: nothing from Task 1 at runtime (independent UI shell).
- Produces: `<Shell>` layout wrapper used by all `(dashboard)` routes; a working `/hotels` route segment that Task 3 fills with real data.

- [ ] **Step 1: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Our workspace libs ship untranspiled ESM; let Next compile them.
  transpilePackages: ['@repo/design-system', '@repo/brand-tokens', '@repo/icons', '@repo/utils'],
};

export default nextConfig;
```

- [ ] **Step 2: Write `.env.example`**

```
# Base URL of the reservation backend (NestJS). Default dev port is 3000.
RESERVATION_API_URL=http://localhost:3000

# Must match the backend's RESERVATION_API_TOKEN.
RESERVATION_API_TOKEN=dev-token
```

- [ ] **Step 3: Write `src/app/providers.tsx`**

```tsx
'use client';
import { ThemeProvider, type ThemeMode } from '@repo/design-system';
import enUS from 'antd/locale/en_US';
import { useCallback } from 'react';

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Client providers wrapper. Seeds the ThemeProvider with the mode resolved on
 * the server (from the cookie) so the first paint matches — no light→dark
 * flash — and persists toggles back to the cookie.
 */
export function Providers({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode: ThemeMode;
}) {
  const persist = useCallback((mode: ThemeMode) => {
    document.cookie = `theme=${mode}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  }, []);

  return (
    <ThemeProvider defaultMode={initialMode} onModeChange={persist} locale={enUS}>
      {children}
    </ThemeProvider>
  );
}
```

Note: the antd `locale` sets built-in component copy (Popconfirm buttons, table empty state, pagination). This app is English, so pass `enUS` explicitly — do NOT use a Portuguese locale.

- [ ] **Step 4: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { ThemeMode } from '@repo/design-system';
import { Providers } from './providers';
// Brand CSS custom properties.
import '@repo/brand-tokens/css';

export const metadata: Metadata = {
  title: 'Reservation — Dashboard',
  description: 'Hotel & room management sample on Ant Design v5.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read the theme preference on the server to avoid a flash on first paint.
  const cookieStore = await cookies();
  const mode: ThemeMode = cookieStore.get('theme')?.value === 'dark' ? 'dark' : 'light';

  return (
    <html lang="en" data-theme={mode} suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <AntdRegistry>
          <Providers initialMode={mode}>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Write `src/components/ThemeToggle.tsx`**

```tsx
'use client';
import { Button, useThemeMode } from '@repo/design-system';
import { BulbFilled, BulbOutlined } from '@ant-design/icons';

/** Toggles light/dark, persisted via the cookie (see app/providers). */
export function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  return (
    <Button
      type="text"
      aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />}
      onClick={toggle}
    />
  );
}
```

- [ ] **Step 6: Write `src/components/shell/Shell.tsx`**

```tsx
'use client';
import { usePathname, useRouter } from 'next/navigation';
import { AppShell, Flex, Menu, Space } from '@repo/design-system';
import { HomeOutlined } from '@ant-design/icons';
import { ProductBranding } from '@/components/product/ProductBranding';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const header = (
    <Flex align="center" justify="space-between" style={{ width: '100%' }} gap="middle">
      <ProductBranding name="Reservation" href="/hotels" />
      <Space align="center" size="small">
        <ThemeToggle />
      </Space>
    </Flex>
  );

  const sidebar = (
    <Menu
      mode="inline"
      selectedKeys={[pathname.startsWith('/hotels') ? 'hotels' : '']}
      style={{ borderInlineEnd: 'none' }}
      onClick={({ key }) => {
        if (key === 'hotels') router.push('/hotels');
      }}
      items={[{ key: 'hotels', icon: <HomeOutlined />, label: 'Hotels' }]}
    />
  );

  return (
    <AppShell header={header} sidebar={sidebar}>
      {children}
    </AppShell>
  );
}
```

`ProductBranding` is NOT exported from `@repo/design-system` (confirmed) — it is app-local in `web`. Create `apps/reservation/src/components/product/ProductBranding.tsx` with this content (copied verbatim from `apps/web/src/components/product/ProductBranding.tsx`):

```tsx
'use client';
import { Space, Typography, theme } from '@repo/design-system';
import type { ReactNode } from 'react';

const { Text } = Typography;

export interface ProductBrandingProps {
  name: string;
  /** Optional custom logo; falls back to a brand-colored mark. */
  logo?: ReactNode;
  href?: string;
}

/** Product identity in the top nav (logo + name). */
export function ProductBranding({ name, logo, href }: ProductBrandingProps) {
  const { token } = theme.useToken();
  const mark = logo ?? (
    <span
      aria-hidden
      style={{
        width: 24,
        height: 24,
        borderRadius: token.borderRadius,
        background: token.colorPrimary,
        display: 'inline-block',
      }}
    />
  );
  const content = (
    <Space align="center" size="small">
      {mark}
      <Text strong style={{ fontSize: token.fontSizeLG }}>
        {name}
      </Text>
    </Space>
  );
  return href ? (
    <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>
      {content}
    </a>
  ) : (
    content
  );
}
```

- [ ] **Step 7: Write `src/app/(dashboard)/layout.tsx`**

```tsx
import { Shell } from '@/components/shell/Shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
```

- [ ] **Step 8: Write `src/app/page.tsx` (redirect)**

```tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/hotels');
}
```

- [ ] **Step 9: Write the temporary `src/app/(dashboard)/hotels/page.tsx`**

```tsx
import { PageHeader } from '@repo/design-system';

export default function HotelsPage() {
  return <PageHeader title="Hotels" subtitle="Coming up in the next task" />;
}
```

- [ ] **Step 10: Verify it builds and boots**

Run: `pnpm --filter reservation typecheck && pnpm --filter reservation build`
Expected: typecheck clean; `next build` succeeds (the `/`, `/hotels` routes compile).

Then run `pnpm --filter reservation dev`, open `http://localhost:3100/` and confirm it redirects to `/hotels`, showing the Shell (Reservation branding, theme toggle works light/dark, Hotels menu item highlighted). Stop the dev server.

- [ ] **Step 11: Commit**

```bash
git add apps/reservation
git commit -m "feat(reservation): app shell, providers, layout, and redirect"
```

---

### Task 3: Hotels CRUD

Real hotels list + create/edit/delete wired to the API, plus a component test. Deliverable: hotels CRUD works end-to-end against a running backend; `hotels-view.test.tsx` passes.

**Files:**

- Modify (replace placeholder): `apps/reservation/src/app/(dashboard)/hotels/page.tsx`
- Create: `apps/reservation/src/app/(dashboard)/hotels/actions.ts`
- Create: `apps/reservation/src/app/(dashboard)/hotels/hotels-view.tsx`
- Test: `apps/reservation/src/app/(dashboard)/hotels/hotels-view.test.tsx`

**Interfaces:**

- Consumes: `listHotels, createHotel, updateHotel, deleteHotel` and the `Hotel` type from Task 1.
- Produces: `createHotelAction(input: CreateHotelInput)`, `updateHotelAction(id: string, input: UpdateHotelInput)`, `deleteHotelAction(id: string)` (server actions); the `HotelsView` component (props `{ hotels: Hotel[] }`). The rooms task links here via `/hotels/[id]/rooms`.

- [ ] **Step 1: Write `actions.ts`**

```ts
'use server';
import { revalidatePath } from 'next/cache';
import { createHotel, deleteHotel, updateHotel } from '@/lib/api';
import type { CreateHotelInput, UpdateHotelInput } from '@/lib/types';

export async function createHotelAction(input: CreateHotelInput) {
  await createHotel(input);
  revalidatePath('/hotels');
}

export async function updateHotelAction(id: string, input: UpdateHotelInput) {
  await updateHotel(id, input);
  revalidatePath('/hotels');
}

export async function deleteHotelAction(id: string) {
  await deleteHotel(id);
  revalidatePath('/hotels');
}
```

- [ ] **Step 2: Write `hotels-view.tsx`**

```tsx
'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  App,
  Button,
  DataTable,
  Form,
  FormModal,
  Input,
  PageHeader,
  Popconfirm,
} from '@repo/design-system';
import { PlusOutlined } from '@ant-design/icons';
import type { Hotel } from '@/lib/types';
import { createHotelAction, deleteHotelAction, updateHotelAction } from './actions';

interface HotelFormValues {
  name: string;
  address?: string;
}

export function HotelsView({ hotels }: { hotels: Hotel[] }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [editing, setEditing] = useState<Hotel | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();

  const filtered = hotels.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (hotel: Hotel) => {
    setEditing(hotel);
    setFormOpen(true);
  };

  const handleSubmit = async (values: HotelFormValues) => {
    try {
      if (editing) {
        await updateHotelAction(editing.id, values);
        message.success('Hotel updated');
      } else {
        await createHotelAction(values);
        message.success('Hotel created');
      }
      setFormOpen(false);
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleDelete = (id: string) =>
    startTransition(async () => {
      try {
        await deleteHotelAction(id);
        message.success('Hotel deleted');
        router.refresh();
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'Something went wrong');
      }
    });

  return (
    <>
      <PageHeader
        title="Hotels"
        subtitle="Manage hotels and their rooms"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New hotel
          </Button>
        }
      />
      <DataTable<Hotel>
        onSearch={setQuery}
        searchPlaceholder="Search hotels…"
        rowKey="id"
        dataSource={filtered}
        pagination={false}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Address', dataIndex: 'address', render: (v?: string) => v ?? '—' },
          {
            title: 'Actions',
            key: 'actions',
            width: 220,
            render: (_, row) => (
              <>
                <Button type="link" onClick={() => router.push(`/hotels/${row.id}/rooms`)}>
                  Rooms
                </Button>
                <Button type="link" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Popconfirm title="Delete hotel?" onConfirm={() => handleDelete(row.id)}>
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
      <FormModal<HotelFormValues>
        key={editing?.id ?? 'new'}
        open={formOpen}
        title={editing ? 'Edit hotel' : 'New hotel'}
        initialValues={editing ? { name: editing.name, address: editing.address } : undefined}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter a name' }]}>
          <Input placeholder="e.g. Grand Hotel" />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input placeholder="e.g. 123 Main St" />
        </Form.Item>
      </FormModal>
    </>
  );
}
```

Note: `FormModal` seeds its form from `initialValues` on mount; the `key={editing?.id ?? 'new'}` remounts it so switching between create and different hotels resets the fields correctly.

- [ ] **Step 3: Write the real `page.tsx`**

```tsx
import { listHotels } from '@/lib/api';
import { HotelsView } from './hotels-view';

export default async function HotelsPage() {
  const hotels = await listHotels();
  return <HotelsView hotels={hotels} />;
}
```

- [ ] **Step 4: Write the failing component test `hotels-view.test.tsx`**

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@repo/design-system';
import { HotelsView } from './hotels-view';
import type { Hotel } from '@/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('./actions', () => ({
  createHotelAction: vi.fn(),
  updateHotelAction: vi.fn(),
  deleteHotelAction: vi.fn(),
}));

const hotels: Hotel[] = [
  { id: 'h1', name: 'Grand Hotel', address: '1 St', createdAt: '', updatedAt: '' },
  { id: 'h2', name: 'Plaza', createdAt: '', updatedAt: '' },
];

function renderView() {
  return render(
    <App>
      <HotelsView hotels={hotels} />
    </App>,
  );
}

describe('HotelsView', () => {
  it('renders a row per hotel', () => {
    renderView();
    expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
    expect(screen.getByText('Plaza')).toBeInTheDocument();
  });

  it('opens the create modal when "New hotel" is clicked', async () => {
    renderView();
    await userEvent.click(screen.getByRole('button', { name: 'New hotel' }));
    expect(
      await screen.findByText('New hotel', { selector: '.ant-modal-title' }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `pnpm --filter reservation test`
Expected: FAIL until `hotels-view.tsx` and `actions.ts` exist (they do after steps 1–2; if you are following strict TDD, write step 4 before steps 2–3 and watch it fail on the missing module).

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm --filter reservation test`
Expected: PASS (api tests + 2 HotelsView tests).

- [ ] **Step 7: Typecheck and manual verification against the backend**

Run: `pnpm --filter reservation typecheck`
Expected: clean.

Then, with the backend running (see Task 5) and `apps/reservation/.env` set, run `pnpm --filter reservation dev` and at `http://localhost:3100/hotels`: create a hotel, edit it, delete it — confirm the table updates and success messages appear. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add apps/reservation
git commit -m "feat(reservation): hotels CRUD"
```

---

### Task 4: Rooms CRUD (nested under a hotel)

Rooms list + create/edit/delete for a given hotel, with a 404 hotel handled via `notFound()` and duplicate room numbers surfaced from the 409. Deliverable: rooms CRUD works end-to-end.

**Files:**

- Create: `apps/reservation/src/app/(dashboard)/hotels/[hotelId]/rooms/page.tsx`
- Create: `apps/reservation/src/app/(dashboard)/hotels/[hotelId]/rooms/actions.ts`
- Create: `apps/reservation/src/app/(dashboard)/hotels/[hotelId]/rooms/rooms-view.tsx`

**Interfaces:**

- Consumes: `getHotel, listRooms, createRoom, updateRoom, deleteRoom`, `ApiError`, and the `Hotel`/`Room` types from Task 1.
- Produces: `createRoomAction(hotelId, input: CreateRoomInput)`, `updateRoomAction(hotelId, id, input: UpdateRoomInput)`, `deleteRoomAction(hotelId, id)` (server actions); the `RoomsView` component (props `{ hotel: Hotel; rooms: Room[] }`).

- [ ] **Step 1: Write `actions.ts`**

```ts
'use server';
import { revalidatePath } from 'next/cache';
import { createRoom, deleteRoom, updateRoom } from '@/lib/api';
import type { CreateRoomInput, UpdateRoomInput } from '@/lib/types';

export async function createRoomAction(hotelId: string, input: CreateRoomInput) {
  await createRoom(hotelId, input);
  revalidatePath(`/hotels/${hotelId}/rooms`);
}

export async function updateRoomAction(hotelId: string, id: string, input: UpdateRoomInput) {
  await updateRoom(hotelId, id, input);
  revalidatePath(`/hotels/${hotelId}/rooms`);
}

export async function deleteRoomAction(hotelId: string, id: string) {
  await deleteRoom(hotelId, id);
  revalidatePath(`/hotels/${hotelId}/rooms`);
}
```

- [ ] **Step 2: Write `rooms-view.tsx`**

```tsx
'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  App,
  Button,
  DataTable,
  Form,
  FormDrawer,
  Input,
  InputNumber,
  PageHeader,
  Popconfirm,
} from '@repo/design-system';
import { PlusOutlined } from '@ant-design/icons';
import type { Hotel, Room } from '@/lib/types';
import { createRoomAction, deleteRoomAction, updateRoomAction } from './actions';

interface RoomFormValues {
  number: string;
  type?: string;
  capacity?: number;
}

export function RoomsView({ hotel, rooms }: { hotel: Hotel; rooms: Room[] }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [editing, setEditing] = useState<Room | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (room: Room) => {
    setEditing(room);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: RoomFormValues) => {
    try {
      if (editing) {
        await updateRoomAction(hotel.id, editing.id, values);
        message.success('Room updated');
      } else {
        await createRoomAction(hotel.id, values);
        message.success('Room created');
      }
      setDrawerOpen(false);
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleDelete = (id: string) =>
    startTransition(async () => {
      try {
        await deleteRoomAction(hotel.id, id);
        message.success('Room deleted');
        router.refresh();
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'Something went wrong');
      }
    });

  return (
    <>
      <PageHeader
        title={hotel.name}
        subtitle="Rooms"
        onBack={() => router.push('/hotels')}
        breadcrumb={[{ title: 'Hotels', href: '/hotels' }, { title: hotel.name }]}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New room
          </Button>
        }
      />
      <DataTable<Room>
        rowKey="id"
        dataSource={rooms}
        pagination={false}
        columns={[
          { title: 'Number', dataIndex: 'number' },
          { title: 'Type', dataIndex: 'type', render: (v?: string) => v ?? '—' },
          { title: 'Capacity', dataIndex: 'capacity', render: (v?: number) => v ?? '—' },
          {
            title: 'Actions',
            key: 'actions',
            width: 160,
            render: (_, row) => (
              <>
                <Button type="link" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Popconfirm title="Delete room?" onConfirm={() => handleDelete(row.id)}>
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />
      <FormDrawer<RoomFormValues>
        key={editing?.id ?? 'new'}
        open={drawerOpen}
        title={editing ? 'Edit room' : 'New room'}
        initialValues={
          editing
            ? { number: editing.number, type: editing.type, capacity: editing.capacity }
            : undefined
        }
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        submitText="Save"
        cancelText="Cancel"
      >
        <Form.Item
          name="number"
          label="Number"
          rules={[{ required: true, message: 'Enter a room number' }]}
        >
          <Input placeholder="e.g. 101" />
        </Form.Item>
        <Form.Item name="type" label="Type">
          <Input placeholder="e.g. double" />
        </Form.Item>
        <Form.Item name="capacity" label="Capacity">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 2" />
        </Form.Item>
      </FormDrawer>
    </>
  );
}
```

- [ ] **Step 3: Write `page.tsx` (with 404 handling)**

```tsx
import { notFound } from 'next/navigation';
import { ApiError, getHotel, listRooms } from '@/lib/api';
import { RoomsView } from './rooms-view';

export default async function RoomsPage({ params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await params;
  try {
    const [hotel, rooms] = await Promise.all([getHotel(hotelId), listRooms(hotelId)]);
    return <RoomsView hotel={hotel} rooms={rooms} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter reservation typecheck`
Expected: clean. (`InputNumber` is re-exported from `@repo/design-system`'s antd facade.)

- [ ] **Step 5: Run the full test suite**

Run: `pnpm --filter reservation test`
Expected: PASS (unchanged; api + HotelsView tests still green).

- [ ] **Step 6: Manual verification against the backend**

With the backend running and `.env` set, run `pnpm --filter reservation dev`:

- From `/hotels`, click "Rooms" on a hotel → `/hotels/<id>/rooms` shows the hotel name and its rooms.
- Create a room (number, type, capacity), edit it, delete it — table updates.
- Create a second room with the SAME number → an error message "Room number already exists in this hotel" appears (from the 409 mapping).
- Visit `/hotels/does-not-exist/rooms` → Next's 404 page renders.
  Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add apps/reservation
git commit -m "feat(reservation): rooms CRUD nested under hotels"
```

---

### Task 5: README, env wiring, and full verification

Documents how to run both apps together and runs the whole workspace gate for this package. Deliverable: a clear README and green lint/typecheck/test.

**Files:**

- Create: `apps/reservation/README.md`

**Interfaces:**

- Consumes: everything above. Produces: no new code interfaces.

- [ ] **Step 1: Write `README.md`**

````markdown
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
````

- [ ] **Step 2: Run the full package gate**

Run: `pnpm --filter reservation lint && pnpm --filter reservation typecheck && pnpm --filter reservation test`
Expected: all green.

- [ ] **Step 3: Confirm the workspace sees the app**

Run: `pnpm --filter reservation build`
Expected: `next build` succeeds; routes `/`, `/hotels`, `/hotels/[hotelId]/rooms` listed in the build output.

- [ ] **Step 4: Commit**

```bash
git add apps/reservation
git commit -m "docs(reservation): README and run instructions"
```

---

## Self-Review

**Spec coverage:**

- Server-side proxy client with auth header, error mapping → Task 1. ✔
- Types mirroring DTOs → Task 1. ✔
- Shell/layout/providers reusing design-system → Task 2. ✔
- Redirect `/` → `/hotels` → Task 2. ✔
- Hotels CRUD (list/create/edit/delete, no room-count column) → Task 3. ✔
- Rooms CRUD nested, FormDrawer, 409 duplicate handling, 404 → notFound → Task 4. ✔
- Unit test (api) + component test (hotels-view) → Tasks 1 & 3. ✔
- Registration (package.json/next.config/tsconfig/eslint), `.env.example`, README, port 3100 → Tasks 1, 2, 5. ✔
- English labels, token never in browser → enforced across tasks. ✔

**Resolved before execution:**

- `ProductBranding` is app-local (not in `@repo/design-system`) — Task 2 Step 6 creates it in-app.
- `useThemeMode`, `ThemeProvider` (with `locale?: ConfigProviderProps['locale']`), and `InputNumber` (via the antd facade) are all exported from `@repo/design-system` — confirmed.
- Coverage thresholds are scoped to `src/lib/**`; if the gate still complains, lower them — coverage is informational for this sample.
