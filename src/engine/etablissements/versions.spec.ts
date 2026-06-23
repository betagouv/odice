import { describe, expect, it } from "vitest";
import { ETABLISSEMENTS_VERSIONS } from "./versions";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("ETABLISSEMENTS_VERSIONS", () => {
  it("contient au moins une version", () => {
    expect(ETABLISSEMENTS_VERSIONS.length).toBeGreaterThan(0);
  });

  it("toutes les dates d'effet sont au format ISO YYYY-MM-DD", () => {
    for (const v of ETABLISSEMENTS_VERSIONS) {
      expect(v.dateEffet).toMatch(ISO_DATE);
    }
  });

  it("les versions sont triées en ordre antéchronologique strict", () => {
    for (let i = 1; i < ETABLISSEMENTS_VERSIONS.length; i += 1) {
      expect(ETABLISSEMENTS_VERSIONS[i - 1].dateEffet > ETABLISSEMENTS_VERSIONS[i].dateEffet).toBe(
        true,
      );
    }
  });

  it("chaque version a un titre d'arrêté non vide et au moins un changement", () => {
    for (const v of ETABLISSEMENTS_VERSIONS) {
      expect(v.arrete.titre.length).toBeGreaterThan(0);
      expect(v.changements.length).toBeGreaterThan(0);
    }
  });

  it("chaque source listée pointe sur un chemin docs/sources/", () => {
    for (const v of ETABLISSEMENTS_VERSIONS) {
      for (const src of v.sources) {
        expect(src.startsWith("docs/sources/")).toBe(true);
      }
    }
  });
});
