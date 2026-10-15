// Règles d'affichage du panneau de résultats (spec « encart sorties »).
// FR interdit ⇔ aucune marque (vérifié sur les deux oracles) : rien d'autre à montrer.

import { Marque, Mouvement, Traitement } from "@engine";
import type { SimulationOutputs } from "./SimulationResult";

export type ResultatAffichage = {
  // Marque, traitement, documents et mentions : seulement si le mouvement FR est autorisé.
  detailsFrance: boolean;
  // Lignes UE du traitement et du document : seulement si le mouvement UE est autorisé.
  lignesUe: boolean;
};

export function resultatAffichage(result: SimulationOutputs): ResultatAffichage {
  const detailsFrance = result.frMouvement === Mouvement.Autorise;
  return {
    detailsFrance,
    lignesUe: detailsFrance && result.ueMouvement === Mouvement.Autorise,
  };
}

// UE interdit avec une marque ovale barrée : le mouvement UE redevient possible après traitement.
export function ueInterditSansTraitement(result: SimulationOutputs): boolean {
  return result.ueMouvement === Mouvement.Interdit && result.marque === Marque.OvaleBarree;
}

// Fin de la mention « Traitement d'atténuation … » (spec « bandeau bleu ») ; null si
// rien à afficher. Seuls les cas listés par la spec produisent une mention.
export function mentionTraitement(result: SimulationOutputs): string | null {
  const frObligatoire = result.frTraitement === Traitement.Obligatoire;
  const ueSansTraitement = ueInterditSansTraitement(result);
  if (frObligatoire && ueSansTraitement) {
    return "obligatoire pour une mise sur le marché sur le territoire national et pour les échanges intracommunautaires";
  }
  if (frObligatoire && result.ueMouvement === Mouvement.Interdit) {
    return "obligatoire pour une mise sur le marché sur le territoire national";
  }
  if (result.frTraitement === Traitement.NonObligatoire && ueSansTraitement) {
    return "obligatoire uniquement pour les échanges intracommunautaires";
  }
  return null;
}
