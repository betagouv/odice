// Règle de détermination du document d'accompagnement UE (certification zoosanitaire).
// Source : docs/sources/abattoirs-test-formules-20260605.xlsx (V2).
// V2 : la dérogation est désormais explicite ("possible") sur 363 cas, dont les
// 195 anciens trous (TODO 2 résolu) et les 27 cas litigieux Grist vs DOCX
// (TODO 3 résolu, on suit la décision V2 qui retient la dérogation).

import { Certification, Marque, Statut, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";

export function evaluateCertification(
  inputs: AbattoirsInputs,
  marque: Marque | null,
): Certification | null {
  const { zoneSuides, statut, zoneAbattoir, mcaAbattoir } = inputs;

  if (marque !== Marque.Ovale) return null;

  if (zoneAbattoir === Zone.ZP || zoneAbattoir === Zone.ZS || zoneAbattoir === Zone.ZIFS) {
    return Certification.Obligatoire;
  }

  // Dérogation possible : suidés zone-indemne/ZRI vers abattoir en zone
  // réglementée I/II/III (peu importe l'agrément MCA).
  if (
    (zoneSuides === Zone.ZoneIndemne || zoneSuides === Zone.ZRI) &&
    (zoneAbattoir === Zone.ZRI || zoneAbattoir === Zone.ZRII || zoneAbattoir === Zone.ZRIII)
  ) {
    return Certification.DerogationPossible;
  }

  // Dérogation possible : ZRII en statut MR-PPA + abattoir MCA en zone
  // réglementée I/II/III (cas tranché dans la V2 du 2026-06-05).
  if (
    zoneSuides === Zone.ZRII &&
    statut === Statut.MrPpa &&
    mcaAbattoir &&
    (zoneAbattoir === Zone.ZRI || zoneAbattoir === Zone.ZRII || zoneAbattoir === Zone.ZRIII)
  ) {
    return Certification.DerogationPossible;
  }

  if (
    (zoneSuides === Zone.ZoneIndemne || zoneSuides === Zone.ZRI) &&
    zoneAbattoir === Zone.ZoneIndemne
  ) {
    return Certification.NonRequise;
  }
  if (
    zoneSuides === Zone.ZRII &&
    statut === Statut.MrPpa &&
    mcaAbattoir &&
    zoneAbattoir === Zone.ZoneIndemne
  ) {
    return Certification.NonRequise;
  }

  return null;
}
