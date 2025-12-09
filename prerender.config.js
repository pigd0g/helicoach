import { levels } from "./src/data.js";

/**
 * Generate all routes for pre-rendering
 * Includes:
 * - Home page (/)
 * - About page (/about)
 * - All level pages (/level/:levelId)
 * - All maneuver detail pages (/level/:levelId/maneuver/:maneuverId)
 */
export function generateRoutes() {
  const routes = [
    "/", // Home page with levels view
    "/about", // About page
  ];

  // Add all level pages
  levels.forEach((level) => {
    routes.push(`/level/${level.id}`);

    // Add all maneuver detail pages for this level
    level.maneuvers.forEach((maneuver) => {
      routes.push(`/level/${level.id}/maneuver/${maneuver.id}`);
    });
  });

  return routes;
}
