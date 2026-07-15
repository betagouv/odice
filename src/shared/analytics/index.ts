// API publique du module analytics.

export { Matomo } from "./Matomo";
export { useMatomo, type UseMatomo } from "./useMatomo";
export {
  MATOMO_EVENT_CATEGORY,
  MATOMO_SIMULATEURS,
  MATOMO_STEPS,
  MATOMO_ANNEXES,
  matomoAction,
  type MatomoSimulateur,
  type MatomoStep,
  type MatomoEventName,
  type MatomoAnnexe,
  type MatomoAction,
} from "./events";
export { matomoSettings, parseMatomoEnv, type MatomoSettings } from "./matomo.env";
export { MATOMO_DIMENSIONS, buildCustomDimensions, type MatomoDimension } from "./dimensions";
export { serialiseCombinaisonAbattoirs, serialiseCombinaisonEtablissements } from "./combinaison";
