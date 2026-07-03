import { describe, expect, it } from "vitest";
import { Marque, Statut, Zone, type AbattoirsInputs, type EtablissementsInputs } from "@engine";
import { serialiseCombinaisonAbattoirs, serialiseCombinaisonEtablissements } from "./combinaison";

const abattoirs: AbattoirsInputs = {
  zoneSuides: Zone.ZRII,
  statut: Statut.MrPpa,
  zoneAbattoir: Zone.ZS,
  mcaAbattoir: true,
  zoneEtbDestinataire: Zone.ZRI,
  mcaEtbDestinataire: false,
};

const etablissements: EtablissementsInputs = {
  zoneSuides: Zone.ZP,
  marqueViandes: Marque.OvaleBarree,
  traitementObligatoireFr: true,
  traitementObligatoireUe: false,
  zoneExpediteur: Zone.ZS,
  mcaExpediteur: true,
  traitementRealise: false,
  zoneDestinataire: Zone.ZoneIndemne,
  mcaDestinataire: true,
};

describe("serialiseCombinaisonAbattoirs", () => {
  it("encode les 6 réponses dans l'ordre des questions", () => {
    expect(serialiseCombinaisonAbattoirs(abattoirs)).toBe("zrii>mr-ppa>zs>oui>zri>non");
  });

  it("encode le statut null en 'na'", () => {
    expect(serialiseCombinaisonAbattoirs({ ...abattoirs, statut: null })).toBe(
      "zrii>na>zs>oui>zri>non",
    );
  });

  it("est déterministe", () => {
    expect(serialiseCombinaisonAbattoirs(abattoirs)).toBe(serialiseCombinaisonAbattoirs(abattoirs));
  });
});

describe("serialiseCombinaisonEtablissements", () => {
  it("encode les 9 réponses dans l'ordre des questions", () => {
    expect(serialiseCombinaisonEtablissements(etablissements)).toBe(
      "zp>ovale-barree>oui>non>zs>oui>non>zone-indemne>oui",
    );
  });

  it("est déterministe", () => {
    expect(serialiseCombinaisonEtablissements(etablissements)).toBe(
      serialiseCombinaisonEtablissements(etablissements),
    );
  });
});
