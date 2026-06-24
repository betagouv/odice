// Provider monté une fois à la racine. Init unique + page view à chaque changement de route.
// Inerte hors production ; ne rend rien.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { matomoSettings } from "./matomo.env";
import { initMatomo } from "./matomo.client";
import { useMatomo } from "./useMatomo";

export function Matomo(): null {
  const { enabled, debug, env } = matomoSettings;
  const { trackPageView } = useMatomo();
  const location = useLocation();

  useEffect(() => {
    if (enabled && env.url && env.siteId) initMatomo(env.url, env.siteId);
  }, [enabled, env.url, env.siteId]);

  useEffect(() => {
    if (!enabled && !debug) return;
    const customUrl = `${window.location.origin}${location.pathname}${location.search}`;
    trackPageView(customUrl);
  }, [enabled, debug, location.pathname, location.search, trackPageView]);

  return null;
}
