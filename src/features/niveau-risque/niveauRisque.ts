// Tableaux de niveau de risque (maquette « Niveau de risque des porcs et des viandes »).
// Ordre = niveau de risque croissant ; le niveau affiché est la position dans le tableau.

import { Marque, Statut, Zone } from "@engine";

export type NiveauAbattoir = { zone: Zone; statut: Statut | null };

export type NiveauViande = {
  zone: Zone;
  marque: Marque | null;
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

// Marques non renseignées dans la maquette (hors ligne 16) : à compléter par le métier.
export const NIVEAUX_VIANDES: NiveauViande[] = [
  { zone: Zone.ZoneIndemne, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRI, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRII, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZIFS, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZS, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZP, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRII, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRII, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZIFS, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZIFS, marque: null, traitementObligatoireNational: false },
  { zone: Zone.ZRIII, marque: null, traitementObligatoireNational: true },
  { zone: Zone.ZRIII, marque: null, traitementObligatoireNational: true },
  { zone: Zone.ZS, marque: Marque.OvaleBarree, traitementObligatoireNational: true },
  { zone: Zone.ZP, marque: null, traitementObligatoireNational: true },
];
