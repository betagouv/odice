// Règle de détermination du document d'accompagnement UE (certification zoosanitaire).
// Source : docs/sources/abattoirs-formules-20260512.docx
// 195 cas connus retournent null malgré UE autorisé (zone indemne/ZRI + non MCA
// + abattoir en ZRI/ZRII/ZRIII) — cf. points-a-valider TODO 2.
// Contradiction sur la condition MCA pour la dérogation — cf. TODO 3.

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

  if (
    (zoneSuides === Zone.ZoneIndemne || zoneSuides === Zone.ZRI) &&
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
