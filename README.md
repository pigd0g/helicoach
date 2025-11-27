# RCHN Pilot Proficiency — Helicopter Coach

Pilot Proficiency is a small mobile-first React app that helps RC helicopter pilots track progress through a structured set of maneuvers, get random practice suggestions, and generate a copyable prompt for an AI coach.

This repository contains a Vite + React frontend and includes Docker assets to build a static production image served by nginx.

## Features

- Browse training Levels and Maneuvers
- Track completed maneuvers (persisted in `localStorage`)
- Random maneuver selector for quick practice
- Per-level "Mark All Completed" action
- AI Coach prompt generator (copies a tailored text to clipboard)
- Lightweight, mobile-first UI using Tailwind CSS

## Tech stack

- React (Vite)
- Tailwind CSS
- LocalStorage for persistence
- Nginx (production static server in Docker image)

## Getting started (development)

Requirements:
- Node 18+ and npm
- (Optional) Docker for containerized runs

Install dependencies:

```powershell
npm ci
```

Run the dev server:

```powershell
npm run dev
```

Open http://localhost:5173 (or the host/port shown by Vite) in your browser.

## Build (production)

Create an optimized static build:

```powershell
npm run build
```

Preview the static build locally with Vite:

```powershell
npm run preview
```

The build output will be in `dist/`.

## Docker (production)

This repo includes a multi-stage `Dockerfile` that builds the app with Node and serves it with nginx.

Build the image locally:

```powershell
docker build -t rchn-app:latest .
```

Run the container:

```powershell
docker run --rm -p 8080:80 rchn-app:latest
```

Or use Docker Compose (bundled `docker-compose.yml`):

```powershell
docker compose up --build
```

The app will be available at `http://localhost:8080`.

## Project structure (important files)

- `src/` — React source files (`App.jsx`, `data.js`, etc.)
- `index.html` — App entry
- `package.json` — scripts and dependencies
- `Dockerfile` — multi-stage Docker build
- `nginx/default.conf` — nginx config (SPA fallback & caching)
- `docker-compose.yml` — convenience compose file

## Contributing

Contributions are welcome. For small improvements or bug fixes:

1. Fork the repo
2. Create a branch
3. Open a PR with a clear description of changes

## Notes

- The app stores completed maneuvers in the browser's `localStorage` under the key `completedManeuvers`.
- If you change the build script name in `package.json`, update the `Dockerfile` accordingly.

---

If you'd like, I can add a GitHub Actions workflow to build and push the Docker image automatically.