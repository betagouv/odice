import { describe, expect, it } from "vitest";
import { Marque, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";
import { evaluateMarque } from "./marque";

function inputs(overrides: Partial<EtablissementsInputs> = {}): EtablissementsInputs {
  return {
    zoneSuides: Zone.ZoneIndemne,
    marqueViandes: Marque.Ovale,
    traitementObligatoireFr: false,
    traitementObligatoireUe: false,
    zoneExpediteur: Zone.ZoneIndemne,
    mcaExpediteur: true,
    traitementRealise: false,
    zoneDestinataire: Zone.ZoneIndemne,
    mcaDestinataire: true,
    ...overrides,
  };
}

describe("evaluateMarque (etablissements)", () => {
  it("zone d'origine saine → ovale quelles que soient les autres entrées", () => {
    expect(evaluateMarque(inputs({ zoneSuides: Zone.ZoneIndemne }))).toBe(Marque.Ovale);
    expect(evaluateMarque(inputs({ zoneSuides: Zone.ZRI }))).toBe(Marque.Ovale);
  });

  it("zone réglementée + ovale entrée + expéditeur/destinataire sains → ovale", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRII,
          marqueViandes: Marque.Ovale,
          zoneExpediteur: Zone.ZoneIndemne,
          zoneDestinataire: Zone.ZRI,
        }),
      ),
    ).toBe(Marque.Ovale);
  });

  it("ovale barrée + expéditeur/destinataire MCA + traitement réalisé → ovale", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRII,
          marqueViandes: Marque.OvaleBarree,
          mcaExpediteur: true,
          mcaDestinataire: true,
          traitementRealise: true,
        }),
      ),
    ).toBe(Marque.Ovale);
  });

  it("ZRIII + ovale barrée + MCA + traitement obligatoire FR + non réalisé → ovale barrée", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRIII,
          marqueViandes: Marque.OvaleBarree,
          mcaExpediteur: true,
          mcaDestinataire: true,
          traitementObligatoireFr: true,
          traitementRealise: false,
        }),
      ),
    ).toBe(Marque.OvaleBarree);
  });

  it("ZI FS + diagonales parallèles en entrée → diagonales parallèles", () => {
    expect(
      evaluateMarque(
        inputs({ zoneSuides: Zone.ZIFS, marqueViandes: Marque.OvaleDiagonalesParalleles }),
      ),
    ).toBe(Marque.OvaleDiagonalesParalleles);
  });

  it("combinaison sans correspondance → null (interdiction)", () => {
    // ZP + ovale barrée + expéditeur non MCA : aucune branche ne s'applique.
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZP,
          marqueViandes: Marque.OvaleBarree,
          mcaExpediteur: false,
          mcaDestinataire: false,
          traitementRealise: false,
        }),
      ),
    ).toBeNull();
  });

  describe("correctif métier 2026-10-08 : expéditeur réglementé agréé MCA, destinataire réglementé non agréé", () => {
    const cas = (overrides: Partial<EtablissementsInputs>) =>
      evaluateMarque(
        inputs({
          marqueViandes: Marque.Ovale,
          mcaExpediteur: true,
          mcaDestinataire: false,
          ...overrides,
        }),
      );

    it("ZI FS partout, ovale en entrée → diagonales parallèles (cas signalé)", () => {
      expect(
        cas({
          zoneSuides: Zone.ZIFS,
          zoneExpediteur: Zone.ZIFS,
          zoneDestinataire: Zone.ZIFS,
        }),
      ).toBe(Marque.OvaleDiagonalesParalleles);
    });

    it("ZI FS / ZRII / ZRIII d'origine, quels que soient les traitements", () => {
      for (const zoneSuides of [Zone.ZIFS, Zone.ZRII, Zone.ZRIII]) {
        for (const traitementRealise of [false, true]) {
          expect(
            cas({
              zoneSuides,
              zoneExpediteur: Zone.ZRIII,
              zoneDestinataire: Zone.ZP,
              traitementRealise,
            }),
          ).toBe(Marque.OvaleDiagonalesParalleles);
        }
      }
    });

    it("ZP / ZS d'origine : diagonales si le traitement est réalisé (condition conservée)", () => {
      for (const zoneSuides of [Zone.ZP, Zone.ZS]) {
        const base = { zoneSuides, zoneExpediteur: Zone.ZS, zoneDestinataire: Zone.ZRII };
        expect(cas({ ...base, traitementRealise: true })).toBe(Marque.OvaleDiagonalesParalleles);
        expect(cas({ ...base, traitementRealise: false })).toBeNull();
      }
    });

    it("destinataire agréé MCA ou en zone saine : le correctif ne s'applique pas", () => {
      const base = { zoneSuides: Zone.ZIFS, zoneExpediteur: Zone.ZIFS };
      expect(cas({ ...base, zoneDestinataire: Zone.ZIFS, mcaDestinataire: true })).toBe(
        Marque.Ovale,
      );
      expect(cas({ ...base, zoneDestinataire: Zone.ZRI })).toBe(Marque.Ovale);
    });
  });
});
