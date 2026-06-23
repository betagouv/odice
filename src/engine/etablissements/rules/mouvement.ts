// Règle de possibilité de mouvement (Autres Établissements).
// Dérive entièrement de la marque de sortie (identique aux abattoirs) :
//   FR autorisé ⟺ une marque est apposée ; UE autorisé ⟺ marque ovale.

import { Marque, Mouvement } from "../../shared/types";

export function evaluateMouvement(marque: Marque | null): { fr: Mouvement; ue: Mouvement } {
  return {
    fr: marque !== null ? Mouvement.Autorise : Mouvement.Interdit,
    ue: marque === Marque.Ovale ? Mouvement.Autorise : Mouvement.Interdit,
  };
}
