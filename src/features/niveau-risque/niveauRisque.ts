// Tableaux de niveau de risque (maquette « Niveau de risque des porcs et des viandes »).
// Ordre = niveau de risque croissant ; le niveau affiché est la position dans le tableau.

import { Marque, Statut, Zone } from "@engine";

export type NiveauAbattoir = { zone: Zone; statut: Statut | null };

export type NiveauViande = {
  zone: Zone;
  marque: Marque;
  traitementObligatoireNational: boolean;
};

export const NIVEAUX_ABATTOIRS: NiveauAbattoir[] = [
  { zone: Zone.ZoneIndemne, statut: null },
  { zone: Zone.ZRI, statut: null },
  { zone: Zone.ZRII, statut: Statut.MrPpa },
  { zone: Zone.ZRIII, statut: Statut.MrPpa },
  { zone: Zone.ZRII, statut: Statut.MnrPpa },
  { zone: Zone.ZIFS, statut: null },
  { zone: Zone.ZRIII, statut: Statut.MnrPpa },
  { zone: Zone.ZS, statut: null },
  { zone: Zone.ZP, statut: null },
];

const { Ovale, OvaleDiagonalesParalleles: Diagonales, OvaleBarree: Barree } = Marque;

// 17 niveaux = les combinaisons zone × marque possibles (ni diagonales en ZS / ZP, ni marque
// spéciale en zone saine) + 2 variantes avec traitement national en ZRIII. Marques déduites
// de cette structure (la maquette ne renseigne que le niveau 16) : ordre diagonales puis
// barrée dans chaque paire, à valider par le métier (docs/questions-metier-refonte-ui.md, Q14).
export const NIVEAUX_VIANDES: NiveauViande[] = [
  { zone: Zone.ZoneIndemne, marque: Ovale, traitementObligatoireNational: false },
  { zone: Zone.ZRI, marque: Ovale, traitementObligatoireNational: false },
  { zone: Zone.ZRII, marque: Ovale, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: Ovale, traitementObligatoireNational: false },
  { zone: Zone.ZIFS, marque: Ovale, traitementObligatoireNational: false },
  { zone: Zone.ZS, marque: Ovale, traitementObligatoireNational: false },
  { zone: Zone.ZP, marque: Ovale, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: Diagonales, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: Barree, traitementObligatoireNational: false },
  { zone: Zone.ZRII, marque: Diagonales, traitementObligatoireNational: false },
  { zone: Zone.ZRII, marque: Barree, traitementObligatoireNational: false },
  { zone: Zone.ZIFS, marque: Diagonales, traitementObligatoireNational: false },
  { zone: Zone.ZIFS, marque: Barree, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: Diagonales, traitementObligatoireNational: true },
  { zone: Zone.ZRIII, marque: Barree, traitementObligatoireNational: true },
  { zone: Zone.ZS, marque: Barree, traitementObligatoireNational: true },
  { zone: Zone.ZP, marque: Barree, traitementObligatoireNational: true },
];

// Part de rouge DSFR (en %) du dernier niveau ; le premier niveau reste sans couleur.
export const INTENSITE_MAX = 45;

// Intensité de l'échelle de couleur pour la ligne `index` (0-based) d'un tableau de `total` lignes.
export function intensiteNiveau(index: number, total: number): number {
  if (total <= 1) return 0;
  return Math.round((INTENSITE_MAX * index) / (total - 1));
}
