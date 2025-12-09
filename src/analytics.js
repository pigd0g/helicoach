export const slugify = (value = "") => {
  return (
    value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled"
  );
};

export const trackEvent = (name, params = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    if (import.meta?.env?.DEV) {
      console.debug("[analytics] gtag not available", { name, params });
    }
    return;
  }

  window.gtag("event", name, params);
};
