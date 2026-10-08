import { describe, expect, it } from "vitest";
import { Marque, Statut, Zone } from "@engine";
import { situationImpossible } from "../simulateurs/etablissements/components/traitementRegles";
import { INTENSITE_MAX, NIVEAUX_ABATTOIRS, NIVEAUX_VIANDES, intensiteNiveau } from "./niveauRisque";

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

describe("NIVEAUX_VIANDES — marques", () => {
  it("renseigne une marque à chaque niveau, dans les 3 marques existantes", () => {
    for (const niveau of NIVEAUX_VIANDES) {
      expect(Object.values(Marque)).toContain(niveau.marque);
    }
  });

  it("n'utilise que des situations possibles dans le formulaire", () => {
    for (const niveau of NIVEAUX_VIANDES) {
      expect(situationImpossible(niveau.zone, niveau.marque)).toBeNull();
    }
  });

  it("ne comporte aucune ovale à diagonales en ZS ou ZP", () => {
    const zonesProtection: Zone[] = [Zone.ZS, Zone.ZP];
    for (const niveau of NIVEAUX_VIANDES.filter((n) => zonesProtection.includes(n.zone))) {
      expect(niveau.marque).not.toBe(Marque.OvaleDiagonalesParalleles);
    }
  });

  it("n'a pas de doublon zone + marque + traitement", () => {
    const cles = NIVEAUX_VIANDES.map(
      (n) => `${n.zone}|${n.marque}|${String(n.traitementObligatoireNational)}`,
    );
    expect(new Set(cles).size).toBe(cles.length);
  });

  it("n'impose le traitement national qu'en ZRIII (marque spéciale) ou en ZS / ZP (ovale barrée)", () => {
    for (const niveau of NIVEAUX_VIANDES.filter((n) => n.traitementObligatoireNational)) {
      const zrIIIMarqueSpeciale = niveau.zone === Zone.ZRIII && niveau.marque !== Marque.Ovale;
      const protectionBarree =
        (niveau.zone === Zone.ZS || niveau.zone === Zone.ZP) &&
        niveau.marque === Marque.OvaleBarree;
      expect(zrIIIMarqueSpeciale || protectionBarree).toBe(true);
    }
  });

  it("garde la marque du niveau 16 donnée par la maquette (ovale barrée en ZS)", () => {
    expect(NIVEAUX_VIANDES[15]).toEqual({
      zone: Zone.ZS,
      marque: Marque.OvaleBarree,
      traitementObligatoireNational: true,
    });
  });
});

describe("intensiteNiveau (échelle de couleur)", () => {
  it("laisse le premier niveau sans couleur et donne le maximum au dernier", () => {
    expect(intensiteNiveau(0, 9)).toBe(0);
    expect(intensiteNiveau(8, 9)).toBe(INTENSITE_MAX);
    expect(intensiteNiveau(16, 17)).toBe(INTENSITE_MAX);
  });

  it("croît strictement avec le niveau", () => {
    for (const total of [9, 17]) {
      for (let i = 1; i < total; i += 1) {
        expect(intensiteNiveau(i, total)).toBeGreaterThan(intensiteNiveau(i - 1, total));
      }
    }
  });

  it("ne plante pas pour un tableau d'une seule ligne", () => {
    expect(intensiteNiveau(0, 1)).toBe(0);
  });
});
