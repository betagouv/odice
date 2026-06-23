// Enums communs aux simulateurs (shared kernel).
// Source de vérité : docs/sources/abattoirs-test-formules-20260512.xlsx

export const Zone = {
  ZoneIndemne: "zone-indemne",
  ZP: "zp",
  ZS: "zs",
  ZIFS: "zi-fs",
  ZRI: "zri",
  ZRII: "zrii",
  ZRIII: "zriii",
} as const;
export type Zone = (typeof Zone)[keyof typeof Zone];

export const Statut = {
  MrPpa: "mr-ppa",
  MnrPpa: "mnr-ppa",
} as const;
export type Statut = (typeof Statut)[keyof typeof Statut];

export const Marque = {
  Ovale: "ovale",
  OvaleBarree: "ovale-barree",
  OvaleDiagonalesParalleles: "ovale-diagonales-paralleles",
} as const;
export type Marque = (typeof Marque)[keyof typeof Marque];

export const Mouvement = {
  Autorise: "autorise",
  Interdit: "interdit",
} as const;
export type Mouvement = (typeof Mouvement)[keyof typeof Mouvement];

export const Traitement = {
  Obligatoire: "obligatoire",
  NonObligatoire: "non-obligatoire",
} as const;
export type Traitement = (typeof Traitement)[keyof typeof Traitement];

export const LPS = {
  Permanent: "lps-permanent",
  Systematique: "lps-systematique",
  NonRequis: "lps-non-requis",
} as const;
export type LPS = (typeof LPS)[keyof typeof LPS];

export const Certification = {
  Obligatoire: "certification-obligatoire",
  DerogationPossible: "derogation-possible",
  NonRequise: "certification-non-requise",
} as const;
export type Certification = (typeof Certification)[keyof typeof Certification];

// Descripteur de version réglementaire, commun aux simulateurs.
// Chaque bounded context maintient son propre tableau (cf. <context>/versions.ts).
export interface SimulateurVersion {
  /** Date d'effet de l'arrêté, format ISO YYYY-MM-DD. */
  dateEffet: string;
  /** Informations sur l'arrêté officiel. */
  arrete: {
    titre: string;
    reference?: string;
    url?: string;
  };
  /** Chemins (depuis la racine du repo) des fichiers sources versionnés. */
  sources: string[];
  /** Liste des changements par rapport à la version précédente. */
  changements: string[];
  /** URL de la pull request GitHub correspondante. */
  pullRequest?: string;
}
