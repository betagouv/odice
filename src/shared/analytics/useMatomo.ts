// Helpers typés autour de _paq. No-op hors production ; log sans envoi en mode debug.

import { useCallback } from "react";
import { matomoSettings } from "./matomo.env";
import { push } from "./matomo.client";
import { MATOMO_EVENT_CATEGORY, type MatomoAction } from "./events";

interface TrackEventOptions {
  name?: string;
  value?: number;
}

// dimensionId Matomo -> valeur.
type CustomDimensions = Record<number, string>;

// Signature Matomo : ['trackEvent', category, action, name, value].
// On ne retire que les positions absentes EN FIN : filtrer tout le tableau décalerait
// la valeur dans le slot "name" quand name est absent (cas duree_saisie).
function buildTrackEventArgs(event: MatomoAction, options: TrackEventOptions): unknown[] {
  const args: unknown[] = [MATOMO_EVENT_CATEGORY, event, options.name, options.value];
  while (args.length > 2 && args[args.length - 1] === undefined) args.pop();
  return ["trackEvent", ...args];
}

export interface UseMatomo {
  trackEvent: (
    event: MatomoAction,
    options?: TrackEventOptions,
    customDimensions?: CustomDimensions,
  ) => void;
  trackPageView: (customUrl?: string) => void;
  enableHeatmaps: () => void;
}

export function useMatomo(): UseMatomo {
  const { enabled, debug } = matomoSettings;

  const trackEvent = useCallback<UseMatomo["trackEvent"]>(
    (event, options = {}, customDimensions = {}) => {
      if (debug) console.info("[ODICE matomo] trackEvent", { event, options, customDimensions });
      if (!enabled) return;
      try {
        const dimensionIds = Object.keys(customDimensions).map(Number);
        // set -> track -> delete : sinon les dimensions fuitent sur les events suivants.
        for (const id of dimensionIds) push(["setCustomDimension", id, customDimensions[id]]);
        push(buildTrackEventArgs(event, options));
        for (const id of dimensionIds) push(["deleteCustomDimension", id]);
      } catch (error) {
        console.warn("[ODICE matomo] trackEvent a échoué", error);
      }
    },
    [enabled, debug],
  );

  const trackPageView = useCallback<UseMatomo["trackPageView"]>(
    (customUrl) => {
      if (debug) console.info("[ODICE matomo] trackPageView", { customUrl });
      if (!enabled) return;
      try {
        if (customUrl) push(["setCustomUrl", customUrl]);
        push(["trackPageView"]);
      } catch (error) {
        console.warn("[ODICE matomo] trackPageView a échoué", error);
      }
    },
    [enabled, debug],
  );

  const enableHeatmaps = useCallback<UseMatomo["enableHeatmaps"]>(() => {
    if (!enabled) return;
    try {
      push(["HeatmapSessionRecording::enable"]);
    } catch (error) {
      console.warn("[ODICE matomo] enableHeatmaps a échoué", error);
    }
  }, [enabled]);

  return { trackEvent, trackPageView, enableHeatmaps };
}
