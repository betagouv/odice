// Wrapper bas niveau autour de window._paq (équivalent de ce que fait @socialgouv/matomo-next).
// Injecte le snippet officiel une seule fois et expose push().

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

let initialised = false;

function getPaq(): unknown[][] {
  if (typeof window === "undefined") return [];
  window._paq = window._paq ?? [];
  return window._paq;
}

export function push(args: unknown[]): void {
  getPaq().push(args);
}

// Init unique : configure le tracker et charge matomo.js. Garde anti double-init.
export function initMatomo(url: string, siteId: string): void {
  if (initialised || typeof document === "undefined") return;
  initialised = true;

  const base = url.endsWith("/") ? url : `${url}/`;
  const paq = getPaq();
  // Mode sans cookie (RGPD) : aucune information de suivi stockée sur l'appareil.
  paq.push(["disableCookies"]);
  paq.push(["enableLinkTracking"]);
  paq.push(["setTrackerUrl", `${base}matomo.php`]);
  paq.push(["setSiteId", siteId]);

  const script = document.createElement("script");
  script.async = true;
  script.src = `${base}matomo.js`;
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}
