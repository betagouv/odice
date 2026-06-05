// Libellés UI accentués pour le simulateur Abattoirs.
// Le moteur travaille en kebab-case ; ce mapping est utilisé côté UI uniquement.

import { Certification, LPS, Marque, Mouvement, Statut, Traitement, Zone } from "@engine";

export const ZONE_LABELS: Record<Zone, string> = {
  [Zone.ZoneIndemne]: "Zone indemne",
  [Zone.ZP]: "ZP — Zone de protection",
  [Zone.ZS]: "ZS — Zone de surveillance",
  [Zone.ZIFS]: "ZI FS — Zone infectée faune sauvage",
  [Zone.ZRI]: "ZRI — Zone réglementée I",
  [Zone.ZRII]: "ZRII — Zone réglementée II",
  [Zone.ZRIII]: "ZRIII — Zone réglementée III",
};

export const STATUT_LABELS: Record<Statut, string> = {
  [Statut.MrPpa]: "MR-PPA — Mouvement réglementé",
  [Statut.MnrPpa]: "MNR-PPA — Mouvement non réglementé",
};

export const MARQUE_LABELS: Record<Marque, string> = {
  [Marque.Ovale]: "Ovale",
  [Marque.OvaleBarree]: "Ovale barrée",
  [Marque.OvaleDiagonalesParalleles]: "Ovale diagonales parallèles",
};

export const MOUVEMENT_LABELS: Record<Mouvement, string> = {
  [Mouvement.Autorise]: "Mouvement autorisé",
  [Mouvement.Interdit]: "Mouvement interdit",
};

export const TRAITEMENT_LABELS: Record<Traitement, string> = {
  [Traitement.Obligatoire]: "Obligatoire",
  [Traitement.NonObligatoire]: "Non obligatoire",
};

export const LPS_LABELS: Record<LPS, string> = {
  [LPS.Permanent]: "LPS permanent",
  [LPS.Systematique]: "LPS systématique",
  [LPS.NonRequis]: "LPS non requis",
};

export const CERTIFICATION_LABELS: Record<Certification, string> = {
  [Certification.Obligatoire]: "Certification zoosanitaire obligatoire",
  [Certification.DerogationPossible]: "Dérogation à la certification zoosanitaire possible",
  [Certification.NonRequise]: "Certification zoosanitaire non requise",
};

// Ordre d'affichage des zones dans les dropdowns (du moins au plus restrictif).
// Ordre validé métier : zone indemne, puis foyers/zones réglementées du moins
// au plus restrictif (ZI FS → ZP → ZS → ZRI → ZRII → ZRIII).
export const ZONE_ORDER: Zone[] = [
  Zone.ZoneIndemne,
  Zone.ZIFS,
  Zone.ZP,
  Zone.ZS,
  Zone.ZRI,
  Zone.ZRII,
  Zone.ZRIII,
];

export const STATUT_ORDER: Statut[] = [Statut.MrPpa, Statut.MnrPpa];

// statut applicable uniquement à ZRII / ZRIII (vérifié sur l'oracle 2 744 cas).
export function isStatutApplicable(zoneSuides: Zone | null): boolean {
  return zoneSuides === Zone.ZRII || zoneSuides === Zone.ZRIII;
}
