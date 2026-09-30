import { describe, expect, it } from "vitest";
import { Zone } from "@engine";
import {
  ZONE_OPTIONS_AVEC_REFLEXE,
  ZONE_ZIFS_REFLEXE,
  isStatutApplicable,
  zoneMoteur,
} from "./abattoirs.labels";

describe("zones du simulateur Abattoirs — option ZI FS réflexe", () => {
  it("est proposée juste après ZI FS", () => {
    const valeurs = ZONE_OPTIONS_AVEC_REFLEXE.map((option) => option.value);
    expect(valeurs.indexOf(ZONE_ZIFS_REFLEXE)).toBe(valeurs.indexOf(Zone.ZIFS) + 1);
  });

  it("est traitée comme ZI FS par le moteur", () => {
    expect(zoneMoteur(ZONE_ZIFS_REFLEXE)).toBe(Zone.ZIFS);
  });

  it("laisse les autres zones inchangées", () => {
    for (const zone of Object.values(Zone)) {
      expect(zoneMoteur(zone)).toBe(zone);
    }
  });

  it("n'active pas le statut (réservé à ZRII / ZRIII)", () => {
    expect(isStatutApplicable(zoneMoteur(ZONE_ZIFS_REFLEXE))).toBe(false);
  });
});
