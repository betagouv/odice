import { describe, expect, it } from "vitest";
import { Certification, Marque, Statut, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";
import { evaluateCertification } from "./certification";

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

describe("evaluateCertification", () => {
  it("ovale + abattoir en ZP → certification obligatoire", () => {
    expect(
      evaluateCertification(
        inputs({ zoneSuides: Zone.ZoneIndemne, zoneAbattoir: Zone.ZP }),
        Marque.Ovale,
      ),
    ).toBe(Certification.Obligatoire);
  });

  it("ovale + zone indemne + MCA abattoir + abattoir ZRII → dérogation possible", () => {
    expect(
      evaluateCertification(
        inputs({
          zoneSuides: Zone.ZoneIndemne,
          mcaAbattoir: true,
          zoneAbattoir: Zone.ZRII,
        }),
        Marque.Ovale,
      ),
    ).toBe(Certification.DerogationPossible);
  });

  it("ovale + ZRI + MCA + abattoir ZRIII → dérogation possible", () => {
    expect(
      evaluateCertification(
        inputs({
          zoneSuides: Zone.ZRI,
          mcaAbattoir: true,
          zoneAbattoir: Zone.ZRIII,
        }),
        Marque.Ovale,
      ),
    ).toBe(Certification.DerogationPossible);
  });

  it("ovale + zone indemne + abattoir indemne → non requise", () => {
    expect(
      evaluateCertification(
        inputs({ zoneSuides: Zone.ZoneIndemne, zoneAbattoir: Zone.ZoneIndemne }),
        Marque.Ovale,
      ),
    ).toBe(Certification.NonRequise);
  });

  it("ovale + ZRII MR-PPA + MCA + abattoir indemne → non requise", () => {
    expect(
      evaluateCertification(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          zoneAbattoir: Zone.ZoneIndemne,
        }),
        Marque.Ovale,
      ),
    ).toBe(Certification.NonRequise);
  });

  it("marque autre que ovale → null", () => {
    expect(evaluateCertification(inputs({ zoneSuides: Zone.ZP }), Marque.OvaleBarree)).toBeNull();
  });

  it("marque null → null", () => {
    expect(
      evaluateCertification(inputs({ zoneSuides: Zone.ZP, mcaAbattoir: false }), null),
    ).toBeNull();
  });

  it("V2 (ex-TODO 2) : ZRI + non MCA + abattoir ZRII + ovale → dérogation possible", () => {
    expect(
      evaluateCertification(
        inputs({
          zoneSuides: Zone.ZRI,
          mcaAbattoir: false,
          zoneAbattoir: Zone.ZRII,
        }),
        Marque.Ovale,
      ),
    ).toBe(Certification.DerogationPossible);
  });

  it("V2 (ex-TODO 3) : ZRII + MR-PPA + MCA + abattoir ZRII + ovale → dérogation possible", () => {
    expect(
      evaluateCertification(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          zoneAbattoir: Zone.ZRII,
        }),
        Marque.Ovale,
      ),
    ).toBe(Certification.DerogationPossible);
  });
});
