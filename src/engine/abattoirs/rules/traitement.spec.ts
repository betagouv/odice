import { describe, expect, it } from "vitest";
import { Marque, Statut, Traitement, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";
import { evaluateTraitement } from "./traitement";

function inputs(overrides: Partial<AbattoirsInputs> = {}): AbattoirsInputs {
  return {
    zoneSuides: Zone.ZoneIndemne,
    statut: null,
    zoneAbattoir: Zone.ZoneIndemne,
    mcaAbattoir: true,
    zoneEtbDestinataire: Zone.ZoneIndemne,
    mcaEtbDestinataire: true,
    ...overrides,
  };
}

describe("evaluateTraitement — FR", () => {
  it("ZP + ovale barrée → FR obligatoire", () => {
    const result = evaluateTraitement(inputs({ zoneSuides: Zone.ZP }), Marque.OvaleBarree);
    expect(result.fr).toBe(Traitement.Obligatoire);
  });

  it("ZRIII MNR-PPA + abattoir MCA → FR obligatoire", () => {
    const result = evaluateTraitement(
      inputs({
        zoneSuides: Zone.ZRIII,
        statut: Statut.MnrPpa,
        mcaAbattoir: true,
      }),
      Marque.OvaleBarree,
    );
    expect(result.fr).toBe(Traitement.Obligatoire);
  });

  it("Zone indemne + marque ovale → FR non obligatoire", () => {
    const result = evaluateTraitement(inputs({ zoneSuides: Zone.ZoneIndemne }), Marque.Ovale);
    expect(result.fr).toBe(Traitement.NonObligatoire);
  });

  it("ZRII + abattoir MCA + marque présente → FR non obligatoire", () => {
    const result = evaluateTraitement(
      inputs({ zoneSuides: Zone.ZRII, statut: Statut.MrPpa, mcaAbattoir: true }),
      Marque.Ovale,
    );
    expect(result.fr).toBe(Traitement.NonObligatoire);
  });

  it("marque null → FR null", () => {
    const result = evaluateTraitement(inputs({ zoneSuides: Zone.ZP, mcaAbattoir: false }), null);
    expect(result.fr).toBeNull();
  });
});

describe("evaluateTraitement — UE", () => {
  it("marque ovale barrée → UE obligatoire (informationnel)", () => {
    const result = evaluateTraitement(inputs({ zoneSuides: Zone.ZP }), Marque.OvaleBarree);
    expect(result.ue).toBe(Traitement.Obligatoire);
  });

  it("Zone indemne + ovale → UE non obligatoire", () => {
    const result = evaluateTraitement(inputs({ zoneSuides: Zone.ZoneIndemne }), Marque.Ovale);
    expect(result.ue).toBe(Traitement.NonObligatoire);
  });

  it("ZRII + ovale → UE non obligatoire", () => {
    const result = evaluateTraitement(
      inputs({ zoneSuides: Zone.ZRII, statut: Statut.MrPpa }),
      Marque.Ovale,
    );
    expect(result.ue).toBe(Traitement.NonObligatoire);
  });

  it("marque null → UE null", () => {
    const result = evaluateTraitement(inputs({ zoneSuides: Zone.ZP, mcaAbattoir: false }), null);
    expect(result.ue).toBeNull();
  });
});
