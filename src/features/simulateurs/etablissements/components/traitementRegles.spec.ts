import { describe, expect, it } from "vitest";
import { Marque, Zone } from "@engine";
import { ZONE_ZIFS_REFLEXE } from "@shared/labels/etablissements.labels";
import oracleRaw from "../../../../../tests/fixtures/etablissements/oracle-32928.json";
import {
  deduireTraitements,
  questionTraitementNationalVisible,
  questionTraitementRealiseVisible,
  situationImpossible,
} from "./traitementRegles";

const { Ovale, OvaleBarree, OvaleDiagonalesParalleles: Diagonales } = Marque;

describe("situationImpossible", () => {
  it("ZI FS réflexe est bloquée dès la saisie de la zone (E2)", () => {
    expect(situationImpossible(ZONE_ZIFS_REFLEXE, null)).toBe("zi-fs-reflexe");
    expect(situationImpossible(ZONE_ZIFS_REFLEXE, Ovale)).toBe("zi-fs-reflexe");
  });

  it("zone indemne ou ZRI avec une marque spéciale : mélange de lot (E1)", () => {
    for (const zone of [Zone.ZoneIndemne, Zone.ZRI]) {
      expect(situationImpossible(zone, OvaleBarree)).toBe("melange-lot");
      expect(situationImpossible(zone, Diagonales)).toBe("melange-lot");
      expect(situationImpossible(zone, Ovale)).toBeNull();
    }
  });

  it("aucune alerte pour les zones réglementées ou une saisie incomplète", () => {
    expect(situationImpossible(Zone.ZRII, OvaleBarree)).toBeNull();
    expect(situationImpossible(Zone.ZIFS, Diagonales)).toBeNull();
    expect(situationImpossible(Zone.ZoneIndemne, null)).toBeNull();
    expect(situationImpossible(null, OvaleBarree)).toBeNull();
  });
});

describe("questionTraitementNationalVisible (E3)", () => {
  it("visible seulement en ZRIII avec une ovale barrée ou à diagonales", () => {
    expect(questionTraitementNationalVisible(Zone.ZRIII, OvaleBarree)).toBe(true);
    expect(questionTraitementNationalVisible(Zone.ZRIII, Diagonales)).toBe(true);
    expect(questionTraitementNationalVisible(Zone.ZRIII, Ovale)).toBe(false);
    for (const zone of [Zone.ZP, Zone.ZS, Zone.ZRII, Zone.ZIFS, Zone.ZoneIndemne]) {
      expect(questionTraitementNationalVisible(zone, OvaleBarree)).toBe(false);
    }
  });
});

describe("questionTraitementRealiseVisible (E5)", () => {
  it("visible pour toute ovale barrée", () => {
    for (const zone of [Zone.ZP, Zone.ZS, Zone.ZRII, Zone.ZIFS, Zone.ZRIII]) {
      expect(questionTraitementRealiseVisible(zone, OvaleBarree, "")).toBe(true);
    }
  });

  it("visible en ZRIII à diagonales seulement si le traitement national est obligatoire", () => {
    expect(questionTraitementRealiseVisible(Zone.ZRIII, Diagonales, "oui")).toBe(true);
    expect(questionTraitementRealiseVisible(Zone.ZRIII, Diagonales, "non")).toBe(false);
    expect(questionTraitementRealiseVisible(Zone.ZRIII, Diagonales, "")).toBe(false);
  });

  it("masquée pour une ovale ou des diagonales hors ZRIII", () => {
    expect(questionTraitementRealiseVisible(Zone.ZP, Ovale, "")).toBe(false);
    expect(questionTraitementRealiseVisible(Zone.ZRII, Diagonales, "")).toBe(false);
  });
});

describe("deduireTraitements", () => {
  const cas: [string, Zone, Marque, ReturnType<typeof deduireTraitements>][] = [
    ["M1 zone indemne, ovale", Zone.ZoneIndemne, Ovale, { fr: false, ue: false, realise: false }],
    ["M1 ZRI, ovale", Zone.ZRI, Ovale, { fr: false, ue: false, realise: false }],
    [
      "M2 ZP, ovale (national OUI par hypothèse)",
      Zone.ZP,
      Ovale,
      { fr: true, ue: true, realise: true },
    ],
    ["M2 ZS, diagonales", Zone.ZS, Diagonales, { fr: true, ue: true, realise: true }],
    ["M5 ZI FS, ovale barrée", Zone.ZIFS, OvaleBarree, { fr: false, ue: true, realise: false }],
    ["M5 ZRII, ovale barrée", Zone.ZRII, OvaleBarree, { fr: false, ue: true, realise: false }],
    ["hypothèse ZRII, ovale", Zone.ZRII, Ovale, { fr: false, ue: false, realise: false }],
    ["hypothèse ZRIII, ovale", Zone.ZRIII, Ovale, { fr: false, ue: false, realise: false }],
    [
      "sans effet ZI FS, diagonales",
      Zone.ZIFS,
      Diagonales,
      { fr: false, ue: false, realise: false },
    ],
  ];

  it.each(cas)("%s", (_nom, zone, marque, attendu) => {
    expect(deduireTraitements(zone, marque, "", "")).toEqual(attendu);
  });

  it("M4 + M3 : ZP ovale barrée → national et UE obligatoires, réalisé saisi", () => {
    expect(deduireTraitements(Zone.ZP, OvaleBarree, "", "oui")).toEqual({
      fr: true,
      ue: true,
      realise: true,
    });
    expect(deduireTraitements(Zone.ZS, OvaleBarree, "", "non").realise).toBe(false);
  });

  it("M6 : ZRIII ovale barrée → UE obligatoire quelle que soit la réponse nationale", () => {
    expect(deduireTraitements(Zone.ZRIII, OvaleBarree, "non", "oui")).toEqual({
      fr: false,
      ue: true,
      realise: true,
    });
  });

  it("ZRIII diagonales : réponses saisies, M3 pour l'UE", () => {
    expect(deduireTraitements(Zone.ZRIII, Diagonales, "oui", "oui")).toEqual({
      fr: true,
      ue: true,
      realise: true,
    });
    // National NON : réalisé masqué, NON par hypothèse.
    expect(deduireTraitements(Zone.ZRIII, Diagonales, "non", "")).toEqual({
      fr: false,
      ue: false,
      realise: false,
    });
  });
});

// Garde-fou : les valeurs déduites « sans effet » ne doivent pas changer le résultat
// du moteur. À revérifier à chaque nouvelle version réglementaire.
describe("oracle — champs masqués sans effet", () => {
  type Oracle = { meta: { inputKeys: string[] }; cases: [(string | number)[], unknown[]][] };
  const oracle = oracleRaw as unknown as Oracle;
  const idx = (cle: string) => oracle.meta.inputKeys.indexOf(cle);
  const resultats = new Map(oracle.cases.map(([e, s]) => [JSON.stringify(e), JSON.stringify(s)]));

  function sansEffet(zone: Zone, marque: Marque, champ: string): boolean {
    const i = idx(champ);
    return oracle.cases
      .filter(([e]) => e[idx("zoneSuides")] === zone && e[idx("marqueViandes")] === marque)
      .every(([e, s]) => {
        const bascule = [...e];
        bascule[i] = e[i] === 1 ? 0 : 1;
        const autre = resultats.get(JSON.stringify(bascule));
        return autre === undefined || autre === JSON.stringify(s);
      });
  }

  it.each([
    [Zone.ZoneIndemne, Ovale],
    [Zone.ZRI, Ovale],
    [Zone.ZRII, Diagonales],
    [Zone.ZIFS, Diagonales],
  ])("%s / %s : aucun champ de traitement n'influence le résultat", (zone, marque) => {
    for (const champ of [
      "traitementObligatoireFr",
      "traitementObligatoireUe",
      "traitementRealise",
    ]) {
      expect(sansEffet(zone, marque, champ)).toBe(true);
    }
  });

  it.each([Ovale, Diagonales])("UE sans effet hors ovale barrée (%s)", (marque) => {
    for (const zone of [Zone.ZP, Zone.ZS, Zone.ZRII, Zone.ZIFS, Zone.ZRIII]) {
      expect(sansEffet(zone, marque, "traitementObligatoireUe")).toBe(true);
    }
  });
});
