import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";

/**
 * Prerender function called by vite-prerender-plugin
 * @param {Object} data - Contains url and other metadata
 * @returns {Object} - Contains html and other metadata
 */
export async function prerender(data) {
  const helmetContext = {};
  
  // Render the app to string
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={data.url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  // Build head elements from react-helmet
  const elements = new Set();
  
  if (helmet) {
    // Add meta tags
    if (helmet.meta) {
      const metaTags = helmet.meta.toString();
      // Parse and add meta tags
      const metaMatches = metaTags.matchAll(/<meta\s+([^>]*)>/g);
      for (const match of metaMatches) {
        const attrs = match[1];
        const props = {};
        
        // Parse attributes
        const attrMatches = attrs.matchAll(/(\w+)="([^"]*)"/g);
        for (const attrMatch of attrMatches) {
          props[attrMatch[1]] = attrMatch[2];
        }
        
        if (Object.keys(props).length > 0) {
          elements.add({ type: "meta", props });
        }
      }
    }
    
    // Add link tags
    if (helmet.link) {
      const linkTags = helmet.link.toString();
      const linkMatches = linkTags.matchAll(/<link\s+([^>]*)>/g);
      for (const match of linkMatches) {
        const attrs = match[1];
        const props = {};
        
        const attrMatches = attrs.matchAll(/(\w+)="([^"]*)"/g);
        for (const attrMatch of attrMatches) {
          props[attrMatch[1]] = attrMatch[2];
        }
        
        if (Object.keys(props).length > 0) {
          elements.add({ type: "link", props });
        }
      }
    }
  }

  return {
    html,
    head: {
      lang: "en",
      title: helmet?.title?.toString().replace(/<title[^>]*>([^<]*)<\/title>/, "$1") || "HeliCoach",
      elements,
    },
  };
}
