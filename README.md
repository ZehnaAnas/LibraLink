# LibraLink

Library Resource & Study Space Management System — prototype built for CIPHER 2.0 by Team Axiom V.

## How to Run

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To check for a clean production build:

```bash
npm run build
```

## What to Demo

- **`/workflow`** (also the landing page `/`) — interactive demo of the booking/conflict-detection logic. Shows the optimistic-locking conflict resolver and live notification feed firing in real time. This is the clearest input → processing → output flow for judges.
- **`/staff`** — Staff terminal. Try scanning (typing) a payload like `LBK:B-002:USR-193:RM-A102:1750612790` into the barcode input and pressing Enter to see the parser resolve it.
- **`/admin`** — Admin dashboard with user management, resource maintenance overrides, and analytics tab.

## Core Logic Implemented

- **Priority Score algorithm** (`src/data/waitlist-engine.ts`) — implements the Case Analysis formula `PS = W_role + U_flag + B_wait − P_loan`, including the role weight (staff/admin +3, student +1), urgency flag (doubles in Peak Mode), uncapped wait-time bonus, and active-loan penalty.
- **Urgency anti-gaming** (`canUseUrgency`) — 48-hour cooldown and 2-per-week cap on self-declared urgent requests.
- **Conflict detection** (`src/lib/conflict-resolver.ts`) — optimistic-locking version check; rejects a booking attempt if the resource's version has changed since the request was made, and dispatches a conflict notification.
- **QR payload spec** (`src/components/staff/QuickActionBar.tsx`) — parses `LBK:`, `SID:`, and `RES:` prefixed scans per the spec in the technical documentation.

## Known Limitations (honest, as the brief recommends disclosing)

This prototype focuses on the core algorithm and conflict-detection logic per the judging criteria, rather than a complete feature set. The following are not yet implemented:

- Student-facing pages (Landing, Login, Student Dashboard, Resources, Book Room, Borrow Device, Waitlist, Notifications, Overdue) are placeholders.
- Three of the five planned Zustand stores (`resourceStore`, `bookingStore`, `activityStore`) are not yet built; only `waitlistStore` and `notificationStore` exist.
- The simulated real-time WebSocket engine (`realtime-engine.ts`) is not implemented.
- Staff terminal keyboard shortcuts (Ctrl+M, Ctrl+O) and scan resolution currently show placeholder confirmations rather than mutating live state.

## Tech Stack

React 19 + TypeScript, Vite, Tailwind CSS v4, shadcn/ui (Radix), Zustand, React Router v7, Recharts, Lucide icons.

