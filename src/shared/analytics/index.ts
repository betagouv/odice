// API publique du module analytics.

export { Matomo } from "./Matomo";
export { useMatomo, type UseMatomo } from "./useMatomo";
export { MATOMO_EVENTS, MATOMO_EVENT_CATEGORY, type MatomoEventName } from "./events";
export { matomoSettings, parseMatomoEnv, type MatomoSettings } from "./matomo.env";
