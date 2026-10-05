import { describe, expect, it } from "vitest";
import { Certification, LPS, Marque, Mouvement, Traitement } from "@engine";
import type { SimulationOutputs } from "./SimulationResult";
import { resultatAffichage } from "./resultatAffichage";

const AUTORISE_PARTOUT: SimulationOutputs = {
  marque: Marque.Ovale,
  frMouvement: Mouvement.Autorise,
  ueMouvement: Mouvement.Autorise,
  frTraitement: Traitement.NonObligatoire,
  ueTraitement: Traitement.NonObligatoire,
  frDocument: LPS.NonRequis,
  ueDocument: Certification.NonRequise,
};

describe("resultatAffichage", () => {
  it("affiche tout quand les mouvements FR et UE sont autorisés", () => {
    expect(resultatAffichage(AUTORISE_PARTOUT)).toEqual({ detailsFrance: true, lignesUe: true });
  });

  it("masque les lignes UE quand le mouvement UE est interdit", () => {
    const result = { ...AUTORISE_PARTOUT, ueMouvement: Mouvement.Interdit };
    expect(resultatAffichage(result)).toEqual({ detailsFrance: true, lignesUe: false });
  });

  it("ne garde que la possibilité de mouvement quand le mouvement FR est interdit", () => {
    const result: SimulationOutputs = {
      ...AUTORISE_PARTOUT,
      marque: null,
      frMouvement: Mouvement.Interdit,
      ueMouvement: Mouvement.Interdit,
    };
    expect(resultatAffichage(result)).toEqual({ detailsFrance: false, lignesUe: false });
  });
});
