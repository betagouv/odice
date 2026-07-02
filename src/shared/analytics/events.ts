// Constantes d'events Matomo centralisées (évite les chaînes magiques).
// Le simulateur est encodé dans l'action (ex. "abattoir_simulation_lancee") pour permettre
// deux funnels Matomo distincts, un par simulateur. Voir docs/matomo-funnel.md.

export const MATOMO_EVENT_CATEGORY = "Simulateur PPA";

// Simulateur = préfixe de l'action. Valeurs alignées sur le type sélectionné dans l'UI.
export const MATOMO_SIMULATEURS = {
  ABATTOIRS: "abattoir",
  ETABLISSEMENTS: "autre",
} as const;
export type MatomoSimulateur = (typeof MATOMO_SIMULATEURS)[keyof typeof MATOMO_SIMULATEURS];

// Étapes du parcours = suffixe de l'action.
export const MATOMO_STEPS = {
  OUVERT: "simulateur_ouvert",
  LANCEE: "simulation_lancee",
  RESULTAT: "resultat_affiche",
  REINITIALISATION: "reinitialisation",
} as const;
export type MatomoStep = (typeof MATOMO_STEPS)[keyof typeof MATOMO_STEPS];

// Action Matomo complète, ex. "abattoir_simulation_lancee".
export type MatomoEventName = `${MatomoSimulateur}_${MatomoStep}`;

export function matomoAction(simulateur: MatomoSimulateur, step: MatomoStep): MatomoEventName {
  return `${simulateur}_${step}`;
}
