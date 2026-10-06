import { describe, expect, it } from "vitest";
import { Statut, Zone } from "@engine";
import { NIVEAUX_ABATTOIRS, NIVEAUX_VIANDES } from "./niveauRisque";

describe("NIVEAUX_ABATTOIRS", () => {
  it("compte 9 niveaux, de la zone indemne à la zone de protection", () => {
    expect(NIVEAUX_ABATTOIRS).toHaveLength(9);
    expect(NIVEAUX_ABATTOIRS[0].zone).toBe(Zone.ZoneIndemne);
    expect(NIVEAUX_ABATTOIRS[8].zone).toBe(Zone.ZP);
  });

  it("ne renseigne le statut que pour ZRII et ZRIII", () => {
    for (const niveau of NIVEAUX_ABATTOIRS) {
      const avecStatut = niveau.zone === Zone.ZRII || niveau.zone === Zone.ZRIII;
      expect(niveau.statut !== null).toBe(avecStatut);
    }
  });

  it("place MR-PPA avant MNR-PPA pour une même zone", () => {
    for (const zone of [Zone.ZRII, Zone.ZRIII]) {
      const mr = NIVEAUX_ABATTOIRS.findIndex((n) => n.zone === zone && n.statut === Statut.MrPpa);
      const mnr = NIVEAUX_ABATTOIRS.findIndex((n) => n.zone === zone && n.statut === Statut.MnrPpa);
      expect(mr).toBeLessThan(mnr);
    }
  });
});

describe("NIVEAUX_VIANDES", () => {
  it("compte 17 niveaux", () => {
    expect(NIVEAUX_VIANDES).toHaveLength(17);
  });

  it("regroupe les traitements obligatoires sur les niveaux les plus élevés", () => {
    const premierTraitement = NIVEAUX_VIANDES.findIndex((n) => n.traitementObligatoireNational);
    expect(premierTraitement).toBe(13);
    expect(
      NIVEAUX_VIANDES.slice(premierTraitement).every((n) => n.traitementObligatoireNational),
    ).toBe(true);
  });
});
