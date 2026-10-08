import { describe, expect, it } from "vitest";
import { Zone } from "@engine";
import {
  ZONE_OPTIONS_AVEC_REFLEXE,
  ZONE_ZIFS_REFLEXE,
  zoneLibelleAvecSigle,
  zoneLibelleLong,
  zoneMoteur,
} from "./common.labels";
import { isStatutApplicable } from "./abattoirs.labels";

describe("zones des simulateurs — option ZI FS réflexe", () => {
  it("est proposée juste avant ZI FS", () => {
    const valeurs = ZONE_OPTIONS_AVEC_REFLEXE.map((option) => option.value);
    expect(valeurs.indexOf(ZONE_ZIFS_REFLEXE)).toBe(valeurs.indexOf(Zone.ZIFS) - 1);
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

describe("zoneLibelleLong", () => {
  it("garde le libellé « réflexe » pour le choix ZI FS réflexe", () => {
    expect(zoneLibelleLong(ZONE_ZIFS_REFLEXE)).toBe("Zone infectée faune sauvage réflexe");
    expect(zoneLibelleLong(Zone.ZIFS)).toBe("Zone infectée faune sauvage");
  });

  it("retire le sigle d'une zone réglementée", () => {
    expect(zoneLibelleLong(Zone.ZRII)).toBe("Zone réglementée II");
  });

  it("laisse la zone indemne telle quelle", () => {
    expect(zoneLibelleLong(Zone.ZoneIndemne)).toBe("Zone indemne");
  });
});

describe("zoneLibelleAvecSigle", () => {
  it("met le sigle entre parenthèses après le libellé long", () => {
    expect(zoneLibelleAvecSigle(Zone.ZRI)).toBe("Zone réglementée I (ZRI)");
    expect(zoneLibelleAvecSigle(Zone.ZIFS)).toBe("Zone infectée faune sauvage (ZI FS)");
  });

  it("laisse la zone indemne sans sigle", () => {
    expect(zoneLibelleAvecSigle(Zone.ZoneIndemne)).toBe("Zone indemne");
  });
});
