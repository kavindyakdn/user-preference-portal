# Frontend (Webix + Vite)

## Prerequisites

- Node.js 18+

## Setup & Run

```bash
cd frontend
npm install
npm run dev   # start Vite dev server
npm run build # production build
npm run preview
```

## Configuration

- `src/config.ts` defines `API_BASE_URL` (expects backend at `/api`).

## Testing (Jest)

```bash
cd frontend
npm test
```

Jest is configured with ts-jest and jsdom. CSS imports are mocked in tests.

## Key Views

- `account` — profile info, photo upload with preview, password change.
- `notifications` — push/email toggles.
- `theme` — skin/color/font settings (Webix skin loader and color picker).
- `privacy` — profile visibility, show email, data sharing.

## Accessibility notes

- Basic alt/aria labeling added for profile photo; further a11y improvements are recommended (focus states, aria-live for toasts, contrast checks).
