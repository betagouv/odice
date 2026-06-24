// Constantes d'events Matomo centralisées (évite les chaînes magiques).
// Funnel adapté au flux réel ODICE : formulaire pleine-page, pas wizard multi-étapes.

export const MATOMO_EVENT_CATEGORY = "Simulateur PPA";

export const MATOMO_EVENTS = {
  SIMULATEUR_OUVERT: "simulateur_ouvert",
  SIMULATION_LANCEE: "simulation_lancee",
  RESULTAT_AFFICHE: "resultat_affiche",
  REINITIALISATION: "reinitialisation",
} as const;

export type MatomoEventName = (typeof MATOMO_EVENTS)[keyof typeof MATOMO_EVENTS];
