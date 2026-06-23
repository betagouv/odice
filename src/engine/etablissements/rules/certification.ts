// Règle de document d'accompagnement UE (certification zoosanitaire) — Autres Établissements.
// Traduction fidèle de la formule Excel (colonne P).
// Dépend de la marque de sortie, de la zone d'origine des suidés et de l'expéditeur.

import { Certification, Marque, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";

export function evaluateCertification(
  inputs: EtablissementsInputs,
  marque: Marque | null,
): Certification | null {
  const { zoneSuides: a, zoneExpediteur: e, mcaExpediteur: f } = inputs;

  if (marque !== Marque.Ovale) return null;

  const aZP_ZS_ZIFS_ZR23 =
    a === Zone.ZIFS || a === Zone.ZP || a === Zone.ZS || a === Zone.ZRII || a === Zone.ZRIII;
  const aZP_ZS_ZIFS_ZRIII = a === Zone.ZIFS || a === Zone.ZP || a === Zone.ZS || a === Zone.ZRIII;

  if (
    e === Zone.ZIFS ||
    e === Zone.ZP ||
    e === Zone.ZS ||
    (aZP_ZS_ZIFS_ZR23 && e === Zone.ZRI && !f) ||
    (aZP_ZS_ZIFS_ZRIII && e === Zone.ZRI && f) ||
    (aZP_ZS_ZIFS_ZR23 && (e === Zone.ZRII || e === Zone.ZRIII))
  ) {
    return Certification.Obligatoire;
  }

  if (
    (a === Zone.ZoneIndemne || a === Zone.ZRI) &&
    (e === Zone.ZRI || e === Zone.ZRII || e === Zone.ZRIII) &&
    !f
  ) {
    return Certification.DerogationPossible;
  }

  if (
    e === Zone.ZoneIndemne ||
    ((a === Zone.ZoneIndemne || a === Zone.ZRI || a === Zone.ZRII) &&
      (e === Zone.ZRI || e === Zone.ZRII || e === Zone.ZRIII) &&
      f)
  ) {
    return Certification.NonRequise;
  }

  return null;
}
