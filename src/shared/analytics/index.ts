// API publique du module analytics.

export { Matomo } from "./Matomo";
export { useMatomo, type UseMatomo } from "./useMatomo";
export {
  MATOMO_EVENT_CATEGORY,
  MATOMO_SIMULATEURS,
  MATOMO_STEPS,
  matomoAction,
  type MatomoSimulateur,
  type MatomoStep,
  type MatomoEventName,
} from "./events";
export { matomoSettings, parseMatomoEnv, type MatomoSettings } from "./matomo.env";
