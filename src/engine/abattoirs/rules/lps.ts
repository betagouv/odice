// Règle de détermination du document d'accompagnement France (LPS).
// Source : docs/sources/abattoirs-formules-20260512.docx
// 35 cas connus retournent null malgré marque présente (ZRII MR-PPA + MCA OUI
// + dest NON MCA + dest en {ZP/ZS/ZI FS/ZRII/ZRIII}) — cf. points-a-valider TODO 1.

import { LPS, Marque, Statut, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";

export function evaluateLPS(inputs: AbattoirsInputs, marque: Marque | null): LPS | null {
  const { zoneSuides, statut, mcaAbattoir, zoneEtbDestinataire, mcaEtbDestinataire } = inputs;

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
  if (
    zoneSuides === Zone.ZRII &&
    statut === Statut.MrPpa &&
    mcaAbattoir &&
    !mcaEtbDestinataire &&
    (zoneEtbDestinataire === Zone.ZoneIndemne || zoneEtbDestinataire === Zone.ZRI)
  ) {
    return LPS.NonRequis;
  }

  return null;
}
