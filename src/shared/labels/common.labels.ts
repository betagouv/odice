// Libellés UI accentués communs aux deux simulateurs.
// Le moteur travaille en kebab-case ; ces mappings servent côté UI uniquement.

import { Certification, LPS, Marque, Mouvement, Traitement, Zone } from "@engine";

export const ZONE_LABELS: Record<Zone, string> = {
  [Zone.ZoneIndemne]: "Zone indemne",
  [Zone.ZP]: "ZP — Zone de protection",
  [Zone.ZS]: "ZS — Zone de surveillance",
  [Zone.ZIFS]: "ZI FS — Zone infectée faune sauvage",
  [Zone.ZRI]: "ZRI — Zone réglementée I",
  [Zone.ZRII]: "ZRII — Zone réglementée II",
  [Zone.ZRIII]: "ZRIII — Zone réglementée III",
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

// Mouvement UE interdit d'une viande à marque ovale barrée (spec « champs sorties »).
export const MOUVEMENT_INTERDIT_SANS_TRAITEMENT_LABEL =
  "Mouvement interdit sans traitement d'atténuation";

export const TRAITEMENT_LABELS: Record<Traitement, string> = {
  [Traitement.Obligatoire]: "Obligatoire",
  [Traitement.NonObligatoire]: "Non-obligatoire",
};

export const LPS_LABELS: Record<LPS, string> = {
  [LPS.Permanent]: "Laissez-passer sanitaire permanent",
  [LPS.Systematique]: "Laissez-passer sanitaire systématique",
  [LPS.NonRequis]: "Laissez-passer sanitaire non requis",
};

export const CERTIFICATION_LABELS: Record<Certification, string> = {
  [Certification.Obligatoire]: "Certificat zoosanitaire",
  [Certification.DerogationPossible]: "Dérogation au certificat zoosanitaire possible",
  [Certification.NonRequise]: "Certificat zoosanitaire non requis",
};

// Libellé sans sigle (« Zone réglementée II »), pour les mentions des documents commerciaux.
export function zoneLibelleLong(zone: Zone): string {
  const libelle = ZONE_LABELS[zone];
  const separateur = libelle.indexOf(" — ");
  return separateur === -1 ? libelle : libelle.slice(separateur + 3);
}

// Libellé long suivi du sigle (« Zone réglementée I (ZRI) »), pour les tableaux de niveau de risque.
export function zoneLibelleAvecSigle(zone: Zone): string {
  const libelle = ZONE_LABELS[zone];
  const separateur = libelle.indexOf(" — ");
  return separateur === -1
    ? libelle
    : `${libelle.slice(separateur + 3)} (${libelle.slice(0, separateur)})`;
}

// Ordre d'affichage des zones dans les dropdowns (du moins au plus restrictif).
export const ZONE_ORDER: Zone[] = [
  Zone.ZoneIndemne,
  Zone.ZIFS,
  Zone.ZP,
  Zone.ZS,
  Zone.ZRI,
  Zone.ZRII,
  Zone.ZRIII,
];

export const MARQUE_ORDER: Marque[] = [
  Marque.Ovale,
  Marque.OvaleBarree,
  Marque.OvaleDiagonalesParalleles,
];

// Infobulle des questions « agrément zoosanitaire MCA » : titre en gras puis définition (maquette).
export const MCA_TOOLTIP = {
  titre: "Agrément zoosanitaire spécifique « Maladie de Catégorie A » (MCA),",
  texte:
    "délivré par l’autorité compétente (DDecPP) aux établissements du secteur alimentaire autorisés à recevoir des animaux ou produits soumis à des restrictions de police sanitaire liées à la PPA.",
};

// Choix « ZI FS réflexe » (toutes les zones des deux simulateurs) : même conditionnalité
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
