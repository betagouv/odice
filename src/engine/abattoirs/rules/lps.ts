// Règle de détermination du document d'accompagnement France (LPS).
// Source : docs/sources/abattoirs-test-formules-20260605.xlsx (V2).
// V2 :
//   - les 35 anciens trous (ZRII MR-PPA + MCA + dest non-MCA dans toutes zones)
//     retournent maintenant "LPS non requis" (TODO 1 résolu, condition zoneDest
//     supprimée),
//   - les 336 cas de mouvement interdit vers une destination saine (zone-indemne
//     ou ZRI) retournent aussi "LPS non requis" explicitement.
// Tous les autres cas mouvement-interdit restent à null (= sans objet).

import { LPS, Marque, Statut, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";

export function evaluateLPS(inputs: AbattoirsInputs, marque: Marque | null): LPS | null {
  const { zoneSuides, statut, zoneEtbDestinataire, mcaAbattoir, mcaEtbDestinataire } = inputs;

  if (marque === Marque.OvaleBarree && mcaAbattoir && mcaEtbDestinataire) {
    return LPS.Permanent;
  }

  if (zoneSuides === Zone.ZRIII && statut === Statut.MnrPpa && mcaAbattoir && !mcaEtbDestinataire) {
    return LPS.Systematique;
  }

  if (marque === Marque.Ovale) {
    return LPS.NonRequis;
  }
  if (zoneSuides === Zone.ZIFS && mcaAbattoir && !mcaEtbDestinataire) {
    return LPS.NonRequis;
  }
  if (zoneSuides === Zone.ZRII && statut === Statut.MnrPpa && mcaAbattoir && !mcaEtbDestinataire) {
    return LPS.NonRequis;
  }
  if (zoneSuides === Zone.ZRIII && statut === Statut.MrPpa && mcaAbattoir && !mcaEtbDestinataire) {
    return LPS.NonRequis;
  }
  // V2 : élargi à tous les zoneEtbDestinataire (avant, restreint à indemne/ZRI).
  if (zoneSuides === Zone.ZRII && statut === Statut.MrPpa && mcaAbattoir && !mcaEtbDestinataire) {
    return LPS.NonRequis;
  }

  // V2 : mouvement interdit (marque null) vers destination saine → explicitement non requis.
  if (
    marque === null &&
    (zoneEtbDestinataire === Zone.ZoneIndemne || zoneEtbDestinataire === Zone.ZRI)
  ) {
    return LPS.NonRequis;
  }

  return null;
}
