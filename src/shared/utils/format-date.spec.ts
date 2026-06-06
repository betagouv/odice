import { describe, expect, it } from "vitest";
import { formatDateIsoToLongFr } from "./format-date";

describe("formatDateIsoToLongFr", () => {
  it("formate une date ISO en français long", () => {
    expect(formatDateIsoToLongFr("2026-02-04")).toBe("4 février 2026");
  });

  it("gère les mois avec accents", () => {
    expect(formatDateIsoToLongFr("2026-08-15")).toBe("15 août 2026");
    expect(formatDateIsoToLongFr("2026-12-01")).toBe("1 décembre 2026");
  });

  it("lève sur format invalide", () => {
    expect(() => formatDateIsoToLongFr("invalide")).toThrow();
    expect(() => formatDateIsoToLongFr("2026/02/04")).toThrow();
  });

  it("lève sur date impossible (mois 13)", () => {
    expect(() => formatDateIsoToLongFr("2026-13-01")).toThrow();
  });

  it("lève sur date impossible (31 février)", () => {
    expect(() => formatDateIsoToLongFr("2026-02-31")).toThrow();
  });
});
