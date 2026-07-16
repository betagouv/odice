// Dimensions personnalisées Matomo (action-scope) émises sur la validation d'une simulation.
// Le nom logique (clé) mappe vers un id numérique via VITE_MATOMO_DIMENSION_<NOM>_ID (cf. matomo.env.ts).

import { matomoSettings } from "./matomo.env";

export const MATOMO_DIMENSIONS = {
  TYPE_ETABLISSEMENT: "type_etablissement",
  ZONE_SUIDES: "zone_suides",
} as const;
export type MatomoDimension = (typeof MATOMO_DIMENSIONS)[keyof typeof MATOMO_DIMENSIONS];

// Construit le mapping { [idMatomo]: valeur } attendu par trackEvent.
// Ignore les dimensions non configurées (id absent) ou vides : aucune fuite si l'env manque.
export function buildCustomDimensions(
  values: Partial<Record<MatomoDimension, string>>,
  dimensions: Record<string, number> = matomoSettings.env.dimensions,
): Record<number, string> {
  const result: Record<number, string> = {};
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined || value === "") continue;
    const id = dimensions[name];
    if (id !== undefined) result[id] = value;
  }
  return result;
}
