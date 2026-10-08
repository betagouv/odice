// Règles d'affichage conditionnel du simulateur Autres établissements (spec
// « Retirer les situations impossibles ») : situations bloquantes, questions de
// traitement affichées et valeurs déduites pour les questions masquées.
// Cf. docs/adr/0016-autres-etablissements-valeurs-deduites.md

import { Marque, Zone } from "@engine";
import {
  ZONE_ZIFS_REFLEXE,
  zoneMoteur,
  type ZoneChoix,
} from "@shared/labels/etablissements.labels";
import { MESSAGE_ZI_FS_REFLEXE_INTERDIT } from "@shared/labels/common.labels";

export type OuiNon = "oui" | "non" | "";

export type SituationImpossible = "melange-lot" | "zi-fs-reflexe";

export const MESSAGES_SITUATION_IMPOSSIBLE: Record<SituationImpossible, string> = {
  "melange-lot":
    "Situation impossible : vérifier qu'il n'y ait pas de mélange de lot. Se référer à l'espace documentaire pour identifier la zone à renseigner.",
  "zi-fs-reflexe": MESSAGE_ZI_FS_REFLEXE_INTERDIT,
};

const ZONES_SAINES: Zone[] = [Zone.ZoneIndemne, Zone.ZRI];
const ZONES_PROTECTION_SURVEILLANCE: Zone[] = [Zone.ZP, Zone.ZS];
const MARQUES_SPECIALES: Marque[] = [Marque.OvaleBarree, Marque.OvaleDiagonalesParalleles];

// Null tant que la situation est possible ou incomplète.
export function situationImpossible(
  zone: ZoneChoix | null,
  marque: Marque | null,
): SituationImpossible | null {
  if (zone === ZONE_ZIFS_REFLEXE) return "zi-fs-reflexe";
  if (
    zone !== null &&
    marque !== null &&
    ZONES_SAINES.includes(zone) &&
    MARQUES_SPECIALES.includes(marque)
  ) {
    return "melange-lot";
  }
  return null;
}

// Seule situation où la réponse n'est pas connue d'avance (spec E3).
export function questionTraitementNationalVisible(
  zone: Zone | null,
  marque: Marque | null,
): boolean {
  return zone === Zone.ZRIII && marque !== null && MARQUES_SPECIALES.includes(marque);
}

// Spec E5 : ovale barrée, ou traitement national déclaré obligatoire par l'utilisateur.
export function questionTraitementRealiseVisible(
  zone: Zone | null,
  marque: Marque | null,
  traitementNational: OuiNon,
): boolean {
  if (marque === Marque.OvaleBarree) return true;
  return questionTraitementNationalVisible(zone, marque) && traitementNational === "oui";
}

export type TraitementsDeduits = { fr: boolean; ue: boolean; realise: boolean };

// Valeurs transmises au moteur : réponse saisie si la question est affichée,
// sinon valeur connue (spec M1 à M6) ou hypothèse validée (cf. ADR-0016).
export function deduireTraitements(
  zone: Zone,
  marque: Marque,
  traitementNational: OuiNon,
  traitementRealise: OuiNon,
): TraitementsDeduits {
  let fr: boolean;
  if (questionTraitementNationalVisible(zone, marque)) fr = traitementNational === "oui";
  else if (ZONES_PROTECTION_SURVEILLANCE.includes(zone))
    fr = true; // M4 (+ hypothèse ovale, diagonales)
  else fr = false; // M1, M5 (+ hypothèse ZRII / ZI FS / ZRIII en ovale)

  // M3 : national obligatoire ⇒ UE obligatoire ; M5 et M6 : ovale barrée hors ZP / ZS.
  const ue = fr || (marque === Marque.OvaleBarree && !ZONES_SAINES.includes(zone));

  let realise: boolean;
  if (questionTraitementRealiseVisible(zone, marque, traitementNational)) {
    realise = traitementRealise === "oui";
  } else {
    realise = ZONES_PROTECTION_SURVEILLANCE.includes(zone); // M2 (+ hypothèse NON ailleurs)
  }

  return { fr, ue, realise };
}

// Zone moteur d'un choix de formulaire (« ZI FS réflexe » bloqué en amont).
export function zoneOuNull(zone: ZoneChoix | ""): Zone | null {
  return zone === "" ? null : zoneMoteur(zone);
}
