# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


        {levels.map((level) => (
          <div key={level.id}>
            {level.maneuvers.map((maneuver) => (
              <div key={`${level.id}-${maneuver.id}`}>
                {maneuver.id} - {maneuver.title}
              </div>
            ))}
          </div>
        ))}
  ## Docker / Deployment

  Build the static site and serve it with nginx using Docker (multi-stage image):

  Build the image locally:

  ```powershell
  docker build -t rchn-app:latest .
  ```

  Run with Docker:

  ```powershell
  docker run --rm -p 8080:80 rchn-app:latest
  ```

  Or use Docker Compose:

  ```powershell
  docker compose up --build
  ```

  This repository includes a `Dockerfile` (multi-stage build), `nginx/default.conf` (SPA fallback), and `docker-compose.yml` for convenience.