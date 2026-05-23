// Règle de détermination de la marque sanitaire.
// Source : docs/sources/abattoirs-formules-20260512.docx
// Vérifié sur 2744/2744 cas (docs/sources/abattoirs-test-formules-20260512.xlsx).

import { Marque, Statut, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";

export function evaluateMarque(inputs: AbattoirsInputs): Marque | null {
  const { zoneSuides, statut, mcaAbattoir, zoneEtbDestinataire, mcaEtbDestinataire } = inputs;

  // --- Marque ovale ---
  if (zoneSuides === Zone.ZoneIndemne || zoneSuides === Zone.ZRI) {
    return Marque.Ovale;
  }
  if (zoneSuides === Zone.ZRII && statut === Statut.MrPpa && mcaAbattoir && mcaEtbDestinataire) {
    return Marque.Ovale;
  }
  if (
    zoneSuides === Zone.ZRII &&
    statut === Statut.MrPpa &&
    mcaAbattoir &&
    !mcaEtbDestinataire &&
    (zoneEtbDestinataire === Zone.ZoneIndemne || zoneEtbDestinataire === Zone.ZRI)
  ) {
    return Marque.Ovale;
  }

  // --- Marque ovale barrée ---
  if (
    (zoneSuides === Zone.ZP || zoneSuides === Zone.ZS || zoneSuides === Zone.ZIFS) &&
    mcaAbattoir &&
    mcaEtbDestinataire
  ) {
    return Marque.OvaleBarree;
  }
  if (
    (zoneSuides === Zone.ZRII || zoneSuides === Zone.ZRIII) &&
    statut === Statut.MnrPpa &&
    mcaAbattoir &&
    mcaEtbDestinataire
  ) {
    return Marque.OvaleBarree;
  }
  if (zoneSuides === Zone.ZRIII && statut === Statut.MrPpa && mcaAbattoir && mcaEtbDestinataire) {
    return Marque.OvaleBarree;
  }

  // --- Marque ovale diagonales parallèles ---
  if (zoneSuides === Zone.ZIFS && mcaAbattoir && !mcaEtbDestinataire) {
    return Marque.OvaleDiagonalesParalleles;
  }
  if (
    (zoneSuides === Zone.ZRII || zoneSuides === Zone.ZRIII) &&
    statut === Statut.MnrPpa &&
    mcaAbattoir &&
    !mcaEtbDestinataire
  ) {
    return Marque.OvaleDiagonalesParalleles;
  }
  if (zoneSuides === Zone.ZRIII && statut === Statut.MrPpa && mcaAbattoir && !mcaEtbDestinataire) {
    return Marque.OvaleDiagonalesParalleles;
  }
  if (
    zoneSuides === Zone.ZRII &&
    statut === Statut.MrPpa &&
    mcaAbattoir &&
    !mcaEtbDestinataire &&
    (zoneEtbDestinataire === Zone.ZP ||
      zoneEtbDestinataire === Zone.ZS ||
      zoneEtbDestinataire === Zone.ZIFS ||
      zoneEtbDestinataire === Zone.ZRII ||
      zoneEtbDestinataire === Zone.ZRIII)
  ) {
    return Marque.OvaleDiagonalesParalleles;
  }

  return null;
}
