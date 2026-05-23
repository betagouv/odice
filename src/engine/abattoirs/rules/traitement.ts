// Règle de détermination du traitement d'atténuation (FR et UE).
// Source : docs/sources/abattoirs-formules-20260512.docx
// UE traitement « obligatoire » conservé même si UE mouvement interdit (sémantique
// informationnelle du DOCX : indique le traitement qui débloquerait l'UE).

import { Marque, Statut, Traitement, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";

function evaluateFrTraitement(inputs: AbattoirsInputs, marque: Marque | null): Traitement | null {
  const { zoneSuides, statut, mcaAbattoir } = inputs;

  if ((zoneSuides === Zone.ZP || zoneSuides === Zone.ZS) && marque === Marque.OvaleBarree) {
    return Traitement.Obligatoire;
  }
  if (zoneSuides === Zone.ZRIII && statut === Statut.MnrPpa && mcaAbattoir) {
    return Traitement.Obligatoire;
  }

  if (marque === null) return null;

  if (zoneSuides === Zone.ZoneIndemne || zoneSuides === Zone.ZRI) {
    return Traitement.NonObligatoire;
  }
  if ((zoneSuides === Zone.ZIFS || zoneSuides === Zone.ZRII) && mcaAbattoir) {
    return Traitement.NonObligatoire;
  }
  if (zoneSuides === Zone.ZRIII && statut === Statut.MrPpa && mcaAbattoir) {
    return Traitement.NonObligatoire;
  }

  return null;
}

function evaluateUeTraitement(inputs: AbattoirsInputs, marque: Marque | null): Traitement | null {
  const { zoneSuides } = inputs;

  if (marque === Marque.OvaleBarree) {
    return Traitement.Obligatoire;
  }

  if (marque === null) return null;

  if (zoneSuides === Zone.ZoneIndemne || zoneSuides === Zone.ZRI) {
    return Traitement.NonObligatoire;
  }
  if (zoneSuides === Zone.ZRII && marque === Marque.Ovale) {
    return Traitement.NonObligatoire;
  }

  return null;
}

export function evaluateTraitement(
  inputs: AbattoirsInputs,
  marque: Marque | null,
): { fr: Traitement | null; ue: Traitement | null } {
  return {
    fr: evaluateFrTraitement(inputs, marque),
    ue: evaluateUeTraitement(inputs, marque),
  };
}
