import { describe, expect, it } from "vitest";
import { Marque, Statut, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";
import { evaluateMarque } from "./marque";

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

describe("evaluateMarque — marque ovale", () => {
  it("Zone indemne → ovale (peu importe le reste)", () => {
    expect(evaluateMarque(inputs({ zoneSuides: Zone.ZoneIndemne }))).toBe(Marque.Ovale);
  });

  it("ZRI → ovale", () => {
    expect(evaluateMarque(inputs({ zoneSuides: Zone.ZRI }))).toBe(Marque.Ovale);
  });

  it("ZRII MR-PPA + abattoir MCA + destinataire MCA → ovale", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: true,
        }),
      ),
    ).toBe(Marque.Ovale);
  });

  it("ZRII MR-PPA + MCA + destinataire non MCA en ZRI → ovale", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
          zoneEtbDestinataire: Zone.ZRI,
        }),
      ),
    ).toBe(Marque.Ovale);
  });
});

describe("evaluateMarque — marque ovale barrée", () => {
  it("ZP + abattoir MCA + destinataire MCA → ovale barrée", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZP,
          mcaAbattoir: true,
          mcaEtbDestinataire: true,
        }),
      ),
    ).toBe(Marque.OvaleBarree);
  });

  it("ZS + abattoir MCA + destinataire MCA → ovale barrée", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZS,
          mcaAbattoir: true,
          mcaEtbDestinataire: true,
        }),
      ),
    ).toBe(Marque.OvaleBarree);
  });

  it("ZRII MNR-PPA + abattoir MCA + destinataire MCA → ovale barrée", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MnrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: true,
        }),
      ),
    ).toBe(Marque.OvaleBarree);
  });

  it("ZRIII MR-PPA + abattoir MCA + destinataire MCA → ovale barrée", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRIII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: true,
        }),
      ),
    ).toBe(Marque.OvaleBarree);
  });
});

describe("evaluateMarque — marque ovale diagonales parallèles", () => {
  it("ZI FS + abattoir MCA + destinataire non MCA → ovale diagonales parallèles", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZIFS,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
        }),
      ),
    ).toBe(Marque.OvaleDiagonalesParalleles);
  });

  it("ZRIII MNR-PPA + abattoir MCA + destinataire non MCA → ovale diagonales parallèles", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRIII,
          statut: Statut.MnrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
        }),
      ),
    ).toBe(Marque.OvaleDiagonalesParalleles);
  });

  it("ZRII MR-PPA + MCA + dest non MCA en ZP → ovale diagonales parallèles", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
          zoneEtbDestinataire: Zone.ZP,
        }),
      ),
    ).toBe(Marque.OvaleDiagonalesParalleles);
  });
});

describe("evaluateMarque — interdiction (marque = null)", () => {
  it("ZP + abattoir non MCA → interdiction", () => {
    expect(evaluateMarque(inputs({ zoneSuides: Zone.ZP, mcaAbattoir: false }))).toBeNull();
  });

  it("ZRIII MR-PPA + abattoir non MCA → interdiction", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZRIII,
          statut: Statut.MrPpa,
          mcaAbattoir: false,
        }),
      ),
    ).toBeNull();
  });

  it("ZP + abattoir MCA + destinataire non MCA → interdiction", () => {
    expect(
      evaluateMarque(
        inputs({
          zoneSuides: Zone.ZP,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
        }),
      ),
    ).toBeNull();
  });
});
