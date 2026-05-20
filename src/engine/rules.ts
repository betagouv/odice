import type { SimulateurInput, SimulateurResult } from "./types";

/**
 * Règles métier PPA appliquées aux inputs du simulateur.
 *
 * TODO: implémenter les règles PPA selon la réglementation en vigueur :
 *   - Détermination de la marque sanitaire à apposer
 *   - Territoire autorisé pour l'expédition
 *   - LPS (Liste Pays/Statut) applicable
 *   - Certification zoosanitaire requise
 *   - Traitement d'atténuation éventuel
 *
 * Chaque règle DOIT référencer sa source réglementaire (instruction technique,
 * arrêté, etc.) dans un commentaire.
 */
export function applyRules(_input: SimulateurInput): SimulateurResult {
  return {
    marqueSanitaire: null,
    territoireAutorise: null,
    lps: null,
    certificationZoosanitaire: null,
    traitementAttenuation: null,
  };
}
