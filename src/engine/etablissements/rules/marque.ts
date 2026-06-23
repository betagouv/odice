// Règle de détermination de la marque de sortie (Autres Établissements).
// Traduction fidèle de la formule Excel (colonne L) — cf. docs/sources/formules-20260623.docx.
// L'établissement reçoit une viande déjà marquée (marqueViandes) et le moteur
// recalcule la marque à apposer en sortie selon zones, agréments MCA et traitement.

import { Marque, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";

// Zone saine = zone indemne ou ZRI ; zone réglementée = les 5 autres.
const isSaine = (z: Zone): boolean => z === Zone.ZoneIndemne || z === Zone.ZRI;
const ZONES_REGLEMENTEES: readonly Zone[] = [Zone.ZIFS, Zone.ZP, Zone.ZS, Zone.ZRII, Zone.ZRIII];
const isReglementee = (z: Zone): boolean => ZONES_REGLEMENTEES.includes(z);

export function evaluateMarque(inputs: EtablissementsInputs): Marque | null {
  const {
    zoneSuides: a,
    marqueViandes: b,
    traitementObligatoireFr: c,
    traitementObligatoireUe: d,
    zoneExpediteur: e,
    mcaExpediteur: f,
    traitementRealise: g,
    zoneDestinataire: h,
    mcaDestinataire: i,
  } = inputs;

  const aReg = isReglementee(a);
  const aZIFSouZR23 = a === Zone.ZIFS || a === Zone.ZRII || a === Zone.ZRIII;
  const aZPouZS = a === Zone.ZP || a === Zone.ZS;
  const ovale = b === Marque.Ovale;
  const barree = b === Marque.OvaleBarree;
  const odp = b === Marque.OvaleDiagonalesParalleles;

  // --- Marque ovale ---
  if (
    isSaine(a) ||
    (aReg && ovale && isSaine(e) && isSaine(h)) ||
    (aReg && ovale && isReglementee(e) && f && isSaine(h)) ||
    (aReg && ovale && isSaine(e) && isReglementee(h) && i) ||
    (aReg && ovale && isReglementee(e) && f && isReglementee(h) && i) ||
    (barree && f && i && g) ||
    (barree && f && g && isSaine(h) && !i)
  ) {
    return Marque.Ovale;
  }

  // --- Marque ovale barrée ---
  if (
    ((a === Zone.ZP || a === Zone.ZS || a === Zone.ZRIII) && barree && f && i && c && !g) ||
    (aZIFSouZR23 && barree && f && i && !c && d && !g)
  ) {
    return Marque.OvaleBarree;
  }

  // --- Marque ovale diagonales parallèles ---
  if (
    (aZIFSouZR23 && ovale && isReglementee(e) && !f && isSaine(h)) ||
    (aZPouZS && ovale && isReglementee(e) && !f && g && isSaine(h)) ||
    (aZIFSouZR23 && ovale && isSaine(e) && isReglementee(h) && !i) ||
    (aZPouZS && ovale && isSaine(e) && g && isReglementee(h) && !i) ||
    (aZIFSouZR23 && ovale && isReglementee(e) && !f && isReglementee(h) && !i) ||
    (aZPouZS && ovale && isReglementee(e) && !f && g && isReglementee(h) && !i) ||
    (aZIFSouZR23 && barree && !f) ||
    (aZIFSouZR23 && barree && !g && !i) ||
    (barree && f && g && isReglementee(h) && !i) ||
    (aZIFSouZR23 && odp) ||
    (aZPouZS && g && odp)
  ) {
    return Marque.OvaleDiagonalesParalleles;
  }

  return null;
}
