# Workspace

## Overview

Matka Admin Panel — a full-stack SaaS-style admin dashboard for managing a Matka (Indian number game) platform.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Build**: esbuild (CJS bundle)

## Admin Credentials

- **Email**: admin@matka.com
- **Password**: admin123

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── admin-panel/        # React + Vite frontend (at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks (with JWT auth)
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Admin Panel Pages

1. **Login** (`/login`) — JWT auth, stored in localStorage
2. **Dashboard** (`/dashboard`) — Stats cards, recent bids table
3. **Markets** (`/markets`) — CRUD for markets (Kalyan, Milan, etc.)
4. **Results** (`/results`) — Declare open/close/jodi/panna results
5. **Game Rates** (`/game-rates`) — Edit payout multipliers
6. **Users** (`/users`) — View/block/unblock users, edit wallet balance
7. **Bids** (`/bids`) — View all bids with filtering
8. **Deposits** (`/deposits`) — Approve/reject deposit requests
9. **Withdrawals** (`/withdrawals`) — Approve/reject withdrawal requests
10. **Notices** (`/notices`) — Create/delete announcements
11. **Settings** (`/settings`) — App name, UPI/bank settings, support phone

## Database Tables

- `admins` — Admin accounts
- `users` — Platform users
- `markets` — Matka markets (Kalyan Morning, Milan Day, etc.)
- `results` — Declared results per market per date
- `bids` — User bids
- `deposits` — Deposit requests
- `withdrawals` — Withdrawal requests
- `game_rates` — Payout multipliers for each game type
- `notices` — User-facing announcements
- `settings` — App-wide settings

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## API Contract

Defined in `lib/api-spec/openapi.yaml`. Run `pnpm --filter @workspace/api-spec run codegen` after changes.

## JWT Auth

- Secret: `JWT_SECRET` env var (defaults to `matka-admin-secret-key-2024`)
- Token stored in `localStorage` as `token`
- `lib/api-client-react/src/custom-fetch.ts` auto-injects `Authorization: Bearer <token>` header
