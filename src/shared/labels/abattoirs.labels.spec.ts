import { describe, expect, it } from "vitest";
import { Zone } from "@engine";
import {
  ZONE_ABATTOIR_OPTIONS,
  ZONE_ABATTOIR_ZIFS_REFLEXE,
  zoneAbattoirMoteur,
} from "./abattoirs.labels";

describe("zone de l'abattoir — option ZI FS réflexe", () => {
  it("est proposée juste après ZI FS", () => {
    const valeurs = ZONE_ABATTOIR_OPTIONS.map((option) => option.value);
    expect(valeurs.indexOf(ZONE_ABATTOIR_ZIFS_REFLEXE)).toBe(valeurs.indexOf(Zone.ZIFS) + 1);
  });

  it("est traitée comme ZI FS par le moteur", () => {
    expect(zoneAbattoirMoteur(ZONE_ABATTOIR_ZIFS_REFLEXE)).toBe(Zone.ZIFS);
  });

  it("laisse les autres zones inchangées", () => {
    for (const zone of Object.values(Zone)) {
      expect(zoneAbattoirMoteur(zone)).toBe(zone);
    }
  });
});
