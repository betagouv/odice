import { describe, expect, it } from "vitest";
import { ABATTOIRS_VERSIONS, formatDateEffet } from "./versions";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe("ABATTOIRS_VERSIONS", () => {
  it("contient au moins une version", () => {
    expect(ABATTOIRS_VERSIONS.length).toBeGreaterThan(0);
  });

  it("toutes les dates d'effet sont au format ISO YYYY-MM-DD", () => {
    for (const v of ABATTOIRS_VERSIONS) {
      expect(v.dateEffet).toMatch(ISO_DATE);
    }
  });

  it("les versions sont triées en ordre antéchronologique strict", () => {
    for (let i = 1; i < ABATTOIRS_VERSIONS.length; i += 1) {
      const prev = ABATTOIRS_VERSIONS[i - 1].dateEffet;
      const curr = ABATTOIRS_VERSIONS[i].dateEffet;
      expect(prev > curr).toBe(true);
    }
  });

  it("chaque version a un titre d'arrêté non vide", () => {
    for (const v of ABATTOIRS_VERSIONS) {
      expect(v.arrete.titre.length).toBeGreaterThan(0);
    }
  });

  it("chaque version a au moins un changement listé", () => {
    for (const v of ABATTOIRS_VERSIONS) {
      expect(v.changements.length).toBeGreaterThan(0);
    }
  });

  it("chaque source listée pointe sur un chemin docs/sources/", () => {
    for (const v of ABATTOIRS_VERSIONS) {
      for (const src of v.sources) {
        expect(src.startsWith("docs/sources/")).toBe(true);
      }
    }
  });
});

describe("formatDateEffet", () => {
  it("formate une date en français long", () => {
    expect(formatDateEffet("2026-02-04")).toBe("4 février 2026");
  });

  it("gère les mois avec accents", () => {
    expect(formatDateEffet("2026-08-15")).toBe("15 août 2026");
    expect(formatDateEffet("2026-12-01")).toBe("1 décembre 2026");
  });

  it("lève sur date invalide", () => {
    expect(() => formatDateEffet("2026-13-01")).toThrow();
    expect(() => formatDateEffet("invalide")).toThrow();
  });
});
