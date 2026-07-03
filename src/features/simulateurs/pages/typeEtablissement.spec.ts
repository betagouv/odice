import { describe, expect, it } from "vitest";
import { TYPE_ETABLISSEMENT_OPTIONS, familleFor } from "./typeEtablissement";

describe("familleFor", () => {
  it("mappe l'abattoir sur sa propre famille", () => {
    expect(familleFor("abattoir")).toBe("abattoir");
  });

  it("mappe les 4 nouveaux types sur le simulateur Autres Établissements", () => {
    expect(familleFor("atelier-decoupe")).toBe("autre");
    expect(familleFor("entrepot")).toBe("autre");
    expect(familleFor("transformation")).toBe("autre");
    expect(familleFor("cuisine-centrale")).toBe("autre");
  });

  it("mappe le type historique autre sur son simulateur", () => {
    expect(familleFor("autre")).toBe("autre");
  });

  it("retourne null pour le placeholder ou une valeur inconnue", () => {
    expect(familleFor("")).toBeNull();
    expect(familleFor("inconnu")).toBeNull();
  });
});

describe("TYPE_ETABLISSEMENT_OPTIONS", () => {
  it("expose des valeurs uniques (indispensable pour l'affichage du select)", () => {
    const valeurs = TYPE_ETABLISSEMENT_OPTIONS.map((option) => option.value);
    expect(new Set(valeurs).size).toBe(valeurs.length);
  });

  it("n'utilise que des familles connues", () => {
    for (const option of TYPE_ETABLISSEMENT_OPTIONS) {
      expect(["abattoir", "autre"]).toContain(option.famille);
    }
  });

  it("contient les 4 nouveaux types redirigeant vers Autres Établissements", () => {
    const nouveaux = [
      "Atelier de découpe",
      "Entrepôt",
      "Établissement de transformation",
      "Cuisine centrale",
    ];
    for (const label of nouveaux) {
      const option = TYPE_ETABLISSEMENT_OPTIONS.find((o) => o.label === label);
      expect(option).toBeDefined();
      expect(option?.famille).toBe("autre");
    }
  });
});
