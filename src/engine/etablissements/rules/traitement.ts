// Règle de traitement d'atténuation (Autres Établissements).
// Traduction fidèle des formules Excel (colonnes M = FR, N = UE).
// FR dépend de la zone, de la marque de sortie et des champs traitement.
// UE dérive uniquement de la marque de sortie.

import { Marque, Traitement, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";

export function evaluateTraitement(
  inputs: EtablissementsInputs,
  marque: Marque | null,
): { fr: Traitement | null; ue: Traitement | null } {
  const { zoneSuides: a, traitementObligatoireFr: c, traitementRealise: g } = inputs;

  let fr: Traitement | null;
  if (
    ((a === Zone.ZP || a === Zone.ZS || a === Zone.ZRIII) && marque === Marque.OvaleBarree) ||
    (a === Zone.ZRIII && marque === Marque.OvaleDiagonalesParalleles && c && !g)
  ) {
    fr = Traitement.Obligatoire;
  } else if (
    marque === Marque.Ovale ||
    ((a === Zone.ZIFS || a === Zone.ZRII) && marque === Marque.OvaleDiagonalesParalleles) ||
    !c ||
    (c && g)
  ) {
    fr = Traitement.NonObligatoire;
  } else {
    fr = null;
  }

  let ue: Traitement | null;
  if (marque === Marque.OvaleBarree) {
    ue = Traitement.Obligatoire;
  } else if (marque === Marque.Ovale) {
    ue = Traitement.NonObligatoire;
  } else {
    ue = null;
  }

  return { fr, ue };
}
