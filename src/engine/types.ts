// Types du moteur ODICE.
// Enums en kebab-case (libellés UI accentués gérés séparément côté front).
// Source de vérité : docs/sources/abattoirs-test-formules-20260512.xlsx

// Enums communs aux simulateurs

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

// Sorties communes

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

// Simulateur Abattoirs

// statut est null hors {ZRII, ZRIII} (sans impact réglementaire ailleurs).
export interface AbattoirsInputs {
  zoneSuides: Zone;
  statut: Statut | null;
  zoneAbattoir: Zone;
  mcaAbattoir: boolean;
  zoneEtbDestinataire: Zone;
  mcaEtbDestinataire: boolean;
}

// marque=null ⇔ interdiction totale. Autres champs null si non applicables.
// Cf. docs/simulateur-abattoirs-points-a-valider.md (TODO 1 et 2).
export interface AbattoirsOutputs {
  marque: Marque | null;
  frMouvement: Mouvement;
  ueMouvement: Mouvement;
  frTraitement: Traitement | null;
  ueTraitement: Traitement | null;
  frDocument: LPS | null;
  ueDocument: Certification | null;
}

// Simulateur Autres Établissements (placeholder — 2e simulateur).

export interface EtablissementsInputs {
  zoneOrigine: Zone | null;
}

export interface EtablissementsOutputs {
  marque: Marque | null;
}

// Union pour le dispatcher racine.
export type SimulateurInputs =
  | ({ kind: "abattoirs" } & AbattoirsInputs)
  | ({ kind: "etablissements" } & EtablissementsInputs);

export type SimulateurOutputs = AbattoirsOutputs | EtablissementsOutputs;
