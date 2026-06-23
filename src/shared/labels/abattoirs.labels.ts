// Libellés UI du simulateur Abattoirs.
// Les libellés communs (zone, marque, mouvement, traitement, LPS, certification)
// sont mutualisés dans common.labels.ts ; ici seulement le spécifique Abattoirs.

import { Statut, Zone } from "@engine";

export {
  ZONE_LABELS,
  MARQUE_LABELS,
  MOUVEMENT_LABELS,
  TRAITEMENT_LABELS,
  LPS_LABELS,
  CERTIFICATION_LABELS,
  ZONE_ORDER,
} from "./common.labels";

export const STATUT_LABELS: Record<Statut, string> = {
  [Statut.MrPpa]: "MR-PPA — Mouvement réglementé",
  [Statut.MnrPpa]: "MNR-PPA — Mouvement non réglementé",
};

export const STATUT_ORDER: Statut[] = [Statut.MrPpa, Statut.MnrPpa];

// statut applicable uniquement à ZRII / ZRIII (vérifié sur l'oracle 2 744 cas).
export function isStatutApplicable(zoneSuides: Zone | null): boolean {
  return zoneSuides === Zone.ZRII || zoneSuides === Zone.ZRIII;
}
