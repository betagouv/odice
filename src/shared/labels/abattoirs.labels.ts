// Libellés UI du simulateur Abattoirs.
// Les libellés communs (zone, marque, mouvement, traitement, LPS, certification)
// sont mutualisés dans common.labels.ts ; ici seulement le spécifique Abattoirs.

import { Statut, Zone } from "@engine";
import { ZONE_LABELS, ZONE_ORDER } from "./common.labels";

export {
  ZONE_LABELS,
  MARQUE_LABELS,
  MOUVEMENT_LABELS,
  TRAITEMENT_LABELS,
  LPS_LABELS,
  CERTIFICATION_LABELS,
  ZONE_ORDER,
  MCA_TOOLTIP,
} from "./common.labels";

export const STATUT_LABELS: Record<Statut, string> = {
  [Statut.MrPpa]: "MR-PPA — Mouvement réglementé",
  [Statut.MnrPpa]: "MNR-PPA — Mouvement non réglementé",
};

export const STATUT_ORDER: Statut[] = [Statut.MrPpa, Statut.MnrPpa];

// Infobulle du champ statut : un paragraphe par statut (cf. maquette refonte Abattoirs).
export const STATUT_TOOLTIP: string[] = [
  "MR-PPA = mouvements des animaux reconnus comme appliquant les dispositions réglementaires vis-à-vis de la PPA",
  "MNR-PPA = mouvements des animaux non reconnus comme appliquant les dispositions réglementaires vis-à-vis de la PPA",
];

// statut applicable uniquement à ZRII / ZRIII (vérifié sur l'oracle 2 744 cas).
export function isStatutApplicable(zoneSuides: Zone | null): boolean {
  return zoneSuides === Zone.ZRII || zoneSuides === Zone.ZRIII;
}

// Choix « ZI FS réflexe » (zones de l'abattoir et d'origine des porcs) : même conditionnalité
// que ZI FS, donc traduit en Zone.ZIFS avant l'appel au moteur (moteur et oracle inchangés).
export const ZONE_ZIFS_REFLEXE = "zi-fs-reflexe";
export type ZoneChoix = Zone | typeof ZONE_ZIFS_REFLEXE;

export const ZONE_OPTIONS_AVEC_REFLEXE: { value: ZoneChoix; label: string }[] = ZONE_ORDER.flatMap(
  (zone) => {
    const option = { value: zone, label: ZONE_LABELS[zone] };
    return zone === Zone.ZIFS
      ? [
          option,
          {
            value: ZONE_ZIFS_REFLEXE,
            label: "ZI FS réflexe — Zone infectée faune sauvage réflexe",
          },
        ]
      : [option];
  },
);

export function zoneMoteur(choix: ZoneChoix): Zone {
  return choix === ZONE_ZIFS_REFLEXE ? Zone.ZIFS : choix;
}
