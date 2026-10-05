import { describe, expect, it } from "vitest";
import { Certification, LPS, Marque, Mouvement, Traitement } from "@engine";
import type { SimulationOutputs } from "./SimulationResult";
import {
  mentionTraitement,
  resultatAffichage,
  ueInterditSansTraitement,
} from "./resultatAffichage";

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

describe("ueInterditSansTraitement", () => {
  const UE_INTERDIT = { ...AUTORISE_PARTOUT, ueMouvement: Mouvement.Interdit };

  it("vrai pour une ovale barrée interdite en UE", () => {
    expect(ueInterditSansTraitement({ ...UE_INTERDIT, marque: Marque.OvaleBarree })).toBe(true);
  });

  it("faux pour une ovale diagonales parallèles interdite en UE", () => {
    const result = { ...UE_INTERDIT, marque: Marque.OvaleDiagonalesParalleles };
    expect(ueInterditSansTraitement(result)).toBe(false);
  });

  it("faux quand le mouvement UE est autorisé", () => {
    expect(ueInterditSansTraitement(AUTORISE_PARTOUT)).toBe(false);
  });
});

describe("mentionTraitement", () => {
  it("obligatoire dès que le traitement FR l'est", () => {
    const result = {
      ...AUTORISE_PARTOUT,
      frTraitement: Traitement.Obligatoire,
      ueTraitement: null,
    };
    expect(mentionTraitement(result)).toBe("obligatoire");
  });

  it("obligatoire uniquement pour l'UE quand seul le traitement UE l'est", () => {
    const result = { ...AUTORISE_PARTOUT, ueTraitement: Traitement.Obligatoire };
    expect(mentionTraitement(result)).toBe(
      "obligatoire uniquement pour les échanges intracommunautaires",
    );
  });

  it("non obligatoire sinon", () => {
    expect(mentionTraitement(AUTORISE_PARTOUT)).toBe("non obligatoire");
  });
});
