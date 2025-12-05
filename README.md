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

Move Timestamps

Level 1: Beginner

0:15 Take-off
0:31 Stationary Hover
1:44 Hover Laterally
3:10 Multiple-level Hover
3:50 3/4 Rear View Hovering
4:39 Full Lateral View Hovering
5:46 Diagonal Hovering
7:27 Constant Heading Circle

Level 2 - Basic Sport

0:00 Introduction
0:17 Constant-Heading Figure 8
3:05 Circuits
5:25 Figure 8
7:55 Side-In Landing
8:55 Pirouette
9:48 Stall Turn
10:27 Inside Loop
10:58 Conclusion

Level 3 - Intermediate Sport

0:30 Stationary Hover (Nose-In)
1:36 Take-Off (Nose-In)
1:50 Constant-Heading Circle (Nose-In)
3:55 Landing (Nose-In)
4:08 540-Degree Stall Turn
4:53 Travelling Rolls
5:34 Loop with Pirouette at Top
6:51 Immelmann
7:43 Half Cuban 8
8:41 Flying Circle
9:46 Center-Heading Figure 8
10:57 Autorotation Landing

Level 4 - Advanced Sport

0:30 Sustained Inverted Flight
1:09 Sustained Inverted Hover
1:59 Inverted Pirouettes
2:45 Inverted Figure 8
3:38 Two Consecutive Stationary Rolls
4:08 180-Degree Autorotations
4:40 Forward Flips
5:44 Backward Flips
6:47 Side Flips
7:43 Two Consecutive Stationary Flips

Level 5 - Basic 3D

0:40 Backward Figure 8
1:36 Backward Inside Loop
2:04 Traveling Backward Rolls
2:45 Sustained Backward Inverted Flight
3:28 Backward Inverted Figure 8
4:18 Inverted Autorotation
5:02 Knife Edge Pirouette
5:44 Death Spiral
6:25 Tic Tocs (Skids Out)
7:18 Vertical 8
8:54 Tumbles

Level 6 - Intermediate 3D

0:57 Sideways Inside Loop
2:02 Sideways Outside Loop
3:06 Sideways Tumbles
4:02 Rainbows
4:30 Tic Tocs (Skids In)
5:19 4 Point Tic Tocs (Skids Out)
5:39 Half-Pirouetting Flips
5:57 Mobius
6:45 Forward Rolling Circles

Level 7 - Advanced 3D

0:00 Pirouetting Inside Loop
1:06 Pirouetting Outside Loop
2:16 Pirouetting Figure 8
4:11 Pirouetting Inverted Figure 8
6:06 Double-Pirouetting Flips
6:46 4-Point Tic Tocs (Skids In)
7:22 Travelling Double-Pirouetting Flips
9:19 Pirouetting Autorotation
10:21 Pirouetting Tic-Tocs (Skids-Out)
