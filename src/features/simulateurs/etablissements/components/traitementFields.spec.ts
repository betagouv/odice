import { describe, expect, it } from "vitest";
import { Zone } from "@engine";
import {
  deriveTraitementObligatoire,
  isTraitementObligatoireApplicable,
  isTraitementUeApplicable,
} from "./traitementFields";

const ZONES_REGLEMENTEES: Zone[] = [Zone.ZP, Zone.ZS, Zone.ZIFS, Zone.ZRII, Zone.ZRIII];

describe("isTraitementObligatoireApplicable", () => {
  it("est faux pour les zones saines (indemne / ZRI) et null", () => {
    expect(isTraitementObligatoireApplicable(Zone.ZoneIndemne)).toBe(false);
    expect(isTraitementObligatoireApplicable(Zone.ZRI)).toBe(false);
    expect(isTraitementObligatoireApplicable(null)).toBe(false);
  });

  it("est vrai pour les zones réglementées", () => {
    for (const zone of ZONES_REGLEMENTEES) {
      expect(isTraitementObligatoireApplicable(zone)).toBe(true);
    }
  });
});

describe("isTraitementUeApplicable", () => {
  it("est faux en zone saine, quel que soit FR", () => {
    expect(isTraitementUeApplicable(Zone.ZoneIndemne, "non")).toBe(false);
    expect(isTraitementUeApplicable(Zone.ZRI, "")).toBe(false);
  });

  it("est faux quand FR = oui (UE nécessairement oui)", () => {
    expect(isTraitementUeApplicable(Zone.ZP, "oui")).toBe(false);
  });

  it("est vrai en zone réglementée tant que FR n'est pas oui", () => {
    expect(isTraitementUeApplicable(Zone.ZP, "non")).toBe(true);
    expect(isTraitementUeApplicable(Zone.ZRII, "")).toBe(true);
  });
});

describe("deriveTraitementObligatoire", () => {
  it("force les deux à false en zone saine", () => {
    expect(deriveTraitementObligatoire(Zone.ZoneIndemne, "oui", "non")).toEqual({
      fr: false,
      ue: false,
    });
    expect(deriveTraitementObligatoire(Zone.ZRI, "", "")).toEqual({ fr: false, ue: false });
  });

  it("force UE à true quand FR = oui (R1)", () => {
    expect(deriveTraitementObligatoire(Zone.ZP, "oui", "")).toEqual({ fr: true, ue: true });
  });

  it("reprend les valeurs saisies quand FR n'est pas oui", () => {
    expect(deriveTraitementObligatoire(Zone.ZP, "non", "oui")).toEqual({ fr: false, ue: true });
    expect(deriveTraitementObligatoire(Zone.ZRII, "non", "non")).toEqual({ fr: false, ue: false });
  });
});
