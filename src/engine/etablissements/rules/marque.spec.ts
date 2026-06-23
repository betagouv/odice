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
});
