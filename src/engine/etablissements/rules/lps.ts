// Règle de document d'accompagnement France (LPS) — Autres Établissements.
// Traduction fidèle de la formule Excel (colonne O).
// Dépend de la marque de sortie ET du traitement FR de sortie (calculés en amont).

import { LPS, Marque, Traitement, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";

export function evaluateLPS(
  inputs: EtablissementsInputs,
  marque: Marque | null,
  frTraitement: Traitement | null,
): LPS | null {
  const { zoneSuides: a, mcaExpediteur: f, mcaDestinataire: i } = inputs;
  const odp = marque === Marque.OvaleDiagonalesParalleles;
  const traitOblig = frTraitement === Traitement.Obligatoire;

  if ((marque === Marque.OvaleBarree && f && i) || (odp && traitOblig && f && i)) {
    return LPS.Permanent;
  }

  if (
    (odp && traitOblig && f && !i) ||
    (odp && traitOblig && !f && !i) ||
    (odp && traitOblig && !f && i)
  ) {
    return LPS.Systematique;
  }

  if (
    marque === Marque.Ovale ||
    ((a === Zone.ZIFS || a === Zone.ZP || a === Zone.ZS || a === Zone.ZRII) && odp) ||
    (a === Zone.ZRIII && odp && frTraitement === Traitement.NonObligatoire)
  ) {
    return LPS.NonRequis;
  }

  return null;
}
