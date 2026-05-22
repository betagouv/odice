/**
 * Types des inputs et outputs des simulateurs ODICE.
 *
 * Ces types sont volontairement larges (string | null) au démarrage du projet.
 * Ils seront raffinés avec des enums dédiés au fur et à mesure de l'intégration
 * de la réglementation PPA en vigueur.
 */

export type SimulateurAbattoirsInput = {
  zoneOrigine: string | null;
  statutSanitaire: string | null;
  agrementMCA: string | null;
  // TODO: ajouter les autres champs réglementaires (5 à 6 inputs au total)
};

export type SimulateurEtablissementsInput = {
  zoneOrigine: string | null;
  typeEtablissement: string | null;
  // TODO: compléter selon la réglementation (5 à 6 inputs au total)
};

export type SimulateurInput = SimulateurAbattoirsInput | SimulateurEtablissementsInput;

export type SimulateurResult = {
  marqueSanitaire: string | null;
  territoireAutorise: string | null;
  lps: string | null;
  certificationZoosanitaire: string | null;
  traitementAttenuation: string | null;
};
