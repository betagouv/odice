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

describe("computeRevealed — sections", () => {
  type Sections = { a: string; b: string; c: string; d: string };
  const VIDE: Sections = { a: "", b: "", c: "", d: "" };
  const SECTIONS: ProgressiveFieldConfig<Sections>[] = [
    { key: "a", section: "s1" },
    { key: "b", section: "s1" },
    { key: "c", section: "s2" },
    { key: "d", section: "s2", isApplicable: (f) => f.c === "cond" },
  ];

  it("révèle d'un coup tous les champs de la première section", () => {
    expect([...computeRevealed(SECTIONS, VIDE, new Set())]).toEqual(["a", "b"]);
  });

  it("attend que toute la section soit remplie avant la suivante", () => {
    const revealed = computeRevealed(SECTIONS, { ...VIDE, a: "x" }, new Set());
    expect(revealed.has("c")).toBe(false);
  });

  it("révèle la section suivante une fois la précédente complète", () => {
    const revealed = computeRevealed(SECTIONS, { ...VIDE, a: "x", b: "y" }, new Set());
    expect([...revealed]).toEqual(["a", "b", "c"]);
  });

  it("ajoute un champ conditionnel à sa section dès qu'il devient applicable", () => {
    const revealed = computeRevealed(SECTIONS, { a: "x", b: "y", c: "cond", d: "" }, new Set());
    expect(revealed.has("d")).toBe(true);
  });

  it("un champ conditionnel vide bloque les sections suivantes", () => {
    type AvecSuite = Sections & { e: string };
    const fields: ProgressiveFieldConfig<AvecSuite>[] = [
      ...(SECTIONS as ProgressiveFieldConfig<AvecSuite>[]),
      { key: "e", section: "s3" },
    ];
    const form: AvecSuite = { a: "x", b: "y", c: "cond", d: "", e: "" };
    expect(computeRevealed(fields, form, new Set()).has("e")).toBe(false);
    expect(computeRevealed(fields, { ...form, d: "z" }, new Set()).has("e")).toBe(true);
  });
});
