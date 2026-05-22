import { describe, it, expect } from "vitest";
import { evaluate } from "./evaluate";
import type { SimulateurAbattoirsInput, SimulateurEtablissementsInput } from "./types";

describe("evaluate", () => {
  it("retourne un résultat avec tous les champs à null pour le simulateur Abattoirs (placeholder)", () => {
    const input: SimulateurAbattoirsInput = {
      zoneOrigine: null,
      statutSanitaire: null,
      agrementMCA: null,
    };

    const result = evaluate(input);

    expect(result).toEqual({
      marqueSanitaire: null,
      territoireAutorise: null,
      lps: null,
      certificationZoosanitaire: null,
      traitementAttenuation: null,
    });
  });

  it("retourne un résultat avec tous les champs à null pour le simulateur Établissements (placeholder)", () => {
    const input: SimulateurEtablissementsInput = {
      zoneOrigine: null,
      typeEtablissement: null,
    };

    const result = evaluate(input);

    expect(result.marqueSanitaire).toBeNull();
    expect(result.territoireAutorise).toBeNull();
    expect(result.lps).toBeNull();
    expect(result.certificationZoosanitaire).toBeNull();
    expect(result.traitementAttenuation).toBeNull();
  });

  it("expose les 5 champs réglementaires attendus", () => {
    const input: SimulateurAbattoirsInput = {
      zoneOrigine: null,
      statutSanitaire: null,
      agrementMCA: null,
    };

    const result = evaluate(input);
    const keys = Object.keys(result).sort();

    expect(keys).toEqual([
      "certificationZoosanitaire",
      "lps",
      "marqueSanitaire",
      "territoireAutorise",
      "traitementAttenuation",
    ]);
  });
});
