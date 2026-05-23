// Règle de détermination des possibilités de mouvement (FR et UE).
// Source : docs/sources/abattoirs-formules-20260512.docx
// - FR autorisé ⇔ marque présente (peu importe laquelle).
// - UE autorisé ⇔ marque ovale uniquement.

import { Marque, Mouvement } from "../../shared/types";

export function evaluateMouvement(marque: Marque | null): {
  fr: Mouvement;
  ue: Mouvement;
} {
  return {
    fr: marque === null ? Mouvement.Interdit : Mouvement.Autorise,
    ue: marque === Marque.Ovale ? Mouvement.Autorise : Mouvement.Interdit,
  };
}
