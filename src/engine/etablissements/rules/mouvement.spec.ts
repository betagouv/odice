import { describe, expect, it } from "vitest";
import { Marque, Mouvement } from "../../shared/types";
import { evaluateMouvement } from "./mouvement";

describe("evaluateMouvement (etablissements)", () => {
  it("marque ovale → FR et UE autorisés", () => {
    expect(evaluateMouvement(Marque.Ovale)).toEqual({
      fr: Mouvement.Autorise,
      ue: Mouvement.Autorise,
    });
  });

  it("marque ovale barrée → FR autorisé, UE interdit", () => {
    expect(evaluateMouvement(Marque.OvaleBarree)).toEqual({
      fr: Mouvement.Autorise,
      ue: Mouvement.Interdit,
    });
  });

  it("marque diagonales parallèles → FR autorisé, UE interdit", () => {
    expect(evaluateMouvement(Marque.OvaleDiagonalesParalleles)).toEqual({
      fr: Mouvement.Autorise,
      ue: Mouvement.Interdit,
    });
  });

  it("pas de marque → FR et UE interdits", () => {
    expect(evaluateMouvement(null)).toEqual({ fr: Mouvement.Interdit, ue: Mouvement.Interdit });
  });
});
