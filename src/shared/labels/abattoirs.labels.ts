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
  ZONE_OPTIONS_AVEC_REFLEXE,
  ZONE_ZIFS_REFLEXE,
  zoneMoteur,
  type ZoneChoix,
} from "./common.labels";

export const STATUT_LABELS: Record<Statut, string> = {
  [Statut.MrPpa]: "MR-PPA — Mouvement réglementé",
  [Statut.MnrPpa]: "MNR-PPA — Mouvement non réglementé",
};

export const STATUT_ORDER: Statut[] = [Statut.MrPpa, Statut.MnrPpa];

// Infobulle du champ statut : une introduction puis un paragraphe par statut.
export const STATUT_TOOLTIP: string[] = [
  "Indique si le mouvement respecte les conditions réglementaires applicables à la PPA",
  "• MR-PPA — Mouvement respectant la réglementation PPA : toutes les conditions réglementaires applicables au mouvement sont respectées.",
  "• MNR-PPA — Mouvement ne respectant pas la réglementation PPA : au moins une des conditions réglementaires applicables au mouvement n’est pas respectée. Des règles particulières s’appliquent alors à sa destination et au devenir des produits.",
];

// statut applicable uniquement à ZRII / ZRIII (vérifié sur l'oracle 2 744 cas).
export function isStatutApplicable(zoneSuides: Zone | null): boolean {
  return zoneSuides === Zone.ZRII || zoneSuides === Zone.ZRIII;
}
