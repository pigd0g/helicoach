import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";

/**
 * Parse HTML string to extract tag attributes
 * @param {string} htmlString - HTML string containing tags
 * @param {string} tagName - Name of the tag to parse (e.g., 'meta', 'link')
 * @returns {Array} Array of tag props objects
 */
function parseHtmlTags(htmlString, tagName) {
  const tags = [];
  const regex = new RegExp(`<${tagName}\\s+([^>]*)>`, 'g');
  const matches = htmlString.matchAll(regex);
  
  for (const match of matches) {
    const attrs = match[1];
    const props = {};
    
    // Parse attributes
    const attrMatches = attrs.matchAll(/(\w+)="([^"]*)"/g);
    for (const attrMatch of attrMatches) {
      props[attrMatch[1]] = attrMatch[2];
    }
    
    if (Object.keys(props).length > 0) {
      tags.push({ type: tagName, props });
    }
  }
  
  return tags;
}

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
      const metaTags = parseHtmlTags(helmet.meta.toString(), 'meta');
      metaTags.forEach(tag => elements.add(tag));
    }
    
    // Add link tags
    if (helmet.link) {
      const linkTags = parseHtmlTags(helmet.link.toString(), 'link');
      linkTags.forEach(tag => elements.add(tag));
    }
  }

  // Extract title from helmet context
  let title = "HeliCoach";
  if (helmet?.title) {
    const titleString = helmet.title.toString();
    // Extract text content between title tags
    const titleMatch = titleString.match(/<title[^>]*>([^<]*)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1];
    }
  }

  return {
    html,
    head: {
      lang: "en",
      title,
      elements,
    },
  };
}
