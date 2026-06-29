import { describe, expect, it } from "vitest";
import { computeRevealed, type ProgressiveFieldConfig } from "./useProgressiveFields";

type Form = {
  a: string;
  b: string;
  c: string;
};

const EMPTY: Form = { a: "", b: "", c: "" };

const FIELDS: ProgressiveFieldConfig<Form>[] = [{ key: "a" }, { key: "b" }, { key: "c" }];

describe("computeRevealed", () => {
  it("ne révèle que le premier champ au départ", () => {
    const revealed = computeRevealed(FIELDS, EMPTY, new Set());
    expect([...revealed]).toEqual(["a"]);
  });

  it("révèle le champ suivant une fois le précédent rempli", () => {
    const revealed = computeRevealed(FIELDS, { ...EMPTY, a: "x" }, new Set(["a"]));
    expect([...revealed]).toEqual(["a", "b"]);
  });

  it("ne révèle qu'un champ à la fois", () => {
    const revealed = computeRevealed(FIELDS, { ...EMPTY, a: "x" }, new Set(["a"]));
    expect(revealed.has("c")).toBe(false);
  });

  it("révèle tous les champs une fois tous remplis", () => {
    const revealed = computeRevealed(FIELDS, { a: "x", b: "y", c: "z" }, new Set(["a", "b"]));
    expect([...revealed]).toEqual(["a", "b", "c"]);
  });

  it("révélation monotone : ne retire jamais un champ déjà révélé", () => {
    const previous = new Set(["a", "b", "c"]);
    const revealed = computeRevealed(FIELDS, { ...EMPTY, a: "x" }, previous);
    expect([...revealed].sort()).toEqual(["a", "b", "c"]);
  });

  it("saute un champ non applicable et révèle le suivant", () => {
    const fields: ProgressiveFieldConfig<Form>[] = [
      { key: "a" },
      { key: "b", isApplicable: (f) => f.a === "skip" },
      { key: "c" },
    ];
    const revealed = computeRevealed(fields, { ...EMPTY, a: "x" }, new Set(["a"]));
    expect(revealed.has("b")).toBe(false);
    expect(revealed.has("c")).toBe(true);
  });

  it("insère un champ conditionnel sans masquer les champs déjà révélés", () => {
    const fields: ProgressiveFieldConfig<Form>[] = [
      { key: "a" },
      { key: "b", isApplicable: (f) => f.a === "cond" },
      { key: "c" },
    ];
    // a et c déjà remplis et révélés ; a devient applicable pour b.
    const previous = new Set(["a", "c"]);
    const revealed = computeRevealed(fields, { a: "cond", b: "", c: "z" }, previous);
    expect(revealed.has("b")).toBe(true);
    expect(revealed.has("c")).toBe(true);
  });
});
