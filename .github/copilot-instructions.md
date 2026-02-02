# Copilot / AI Agent Instructions — HeliCoach

Purpose: give AI coding agents the essential, actionable knowledge to be productive in this repo.

- Project type: Vite + React (client-only SPA). Tailwind for styling. Build output is static in `dist/` and served by `nginx` in Docker.
- Primary scripts: `npm run dev` (vite --host), `npm run build` (vite build), `npm run preview` (vite preview), `npm run lint` (eslint .).
- Docker: multi-stage `Dockerfile` builds and serves `dist/` with nginx; `docker-compose.yml` included for convenience.

Key files to inspect and edit

- `src/data.js` — canonical source of all `levels` and `maneuvers`. When changing content, keep `maneuver.id` values stable (they are used as keys in localStorage and URLs).
- `src/App.jsx` — central app state, routing behavior, prompt generator (`handleCopyPrompt`), import/export logic and localStorage usage.
- `src/components/*` — UI pieces; important ones are `LevelsView.jsx`, `ManeuversView.jsx`, `ManeuverDetail.jsx`, `LevelCard.jsx`, `Tips.jsx`, `Header.jsx`.
- `src/analytics.js` — helper `slugify()` and `trackEvent()`; `trackEvent` is a noop unless `window.gtag` exists.
- `nginx/default.conf` — production SPA fallback and caching rules. Update if route behavior changes.

Routing & URL conventions (important)

- Client routing uses `BrowserRouter`. Recognized paths:
  - `/` → levels view
  - `/about` → about view
  - `/level/:id` → maneuvers list for a level
  - `/level/:id/maneuver/:maneuverId` → detail for a maneuver
- App derives view from `location.pathname` in `App.jsx`. Prefer updating `App.jsx` if you add routes.

Data persistence & import/export

- Completed maneuvers are persisted in `localStorage` under the key `completedManeuvers` (an object where keys are maneuver ids and values are true).
- Export format (see `handleExportData` in `App.jsx`):
  {
  completedManeuvers: { <id>: true, ... },
  exportedAt: "ISO timestamp",
  version: 1
  }
- Import sanitizes incoming ids against `levels` from `src/data.js`. Follow that pattern when adding other importers.

Video URL handling

- `selectedLevel.video` is a YouTube URL where the code extracts the last path segment as the video id.
- `selectedManeuver.url` may include a `t` query param for start time; the app parses it to build an embed URL with `?start=`.

Styling & UX patterns

- Mobile-first Tailwind classes across components. Components expect small single-responsibility functions and return JSX only.
- Confetti is triggered in `ManeuversView.jsx` and `ManeuverDetail.jsx` when marking complete — keep this UX behavior when changing completion flows.

Analytics & telemetry

- `trackEvent(name, params)` wraps `window.gtag` and is safe to call in DEV (it logs debug when `import.meta.env.DEV`). Use `analytics.slugify()` for consistent names.

Developer workflows

- Local dev: `npm ci` then `npm run dev` (Vite serves at 5173 by default). `--host` is used to make the dev server reachable on LAN.
- Build: `npm run build` produces `dist/`. Preview with `npm run preview` or run the provided Dockerfile.
- Lint: `npm run lint` (ESLint config at project root). No test runner present.

Editing guidance (practical tips)

- When adding or renaming maneuvers, update `src/data.js` and keep `id` stable (strings like "1.1").
- If you change the build script name or output directory, update the `Dockerfile` and `nginx/default.conf` accordingly.
- Use `App.jsx` for changes to state/persistence or prompt generation; UI-only changes should live in `src/components/*.jsx`.

If anything here is unclear or you'd like more detail (examples of a specific refactor, a sample PR checklist, or expanded testing/dev container commands), tell me which area to expand.
