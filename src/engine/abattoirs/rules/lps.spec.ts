import { describe, expect, it } from "vitest";
import { LPS, Marque, Statut, Zone } from "../../shared/types";
import type { AbattoirsInputs } from "../types";
import { evaluateLPS } from "./lps";

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

describe("evaluateLPS", () => {
  it("ovale barrée + abattoir MCA + destinataire MCA → LPS permanent", () => {
    expect(
      evaluateLPS(
        inputs({
          zoneSuides: Zone.ZP,
          mcaAbattoir: true,
          mcaEtbDestinataire: true,
        }),
        Marque.OvaleBarree,
      ),
    ).toBe(LPS.Permanent);
  });

  it("ZRIII MNR-PPA + MCA abattoir + non MCA destinataire → LPS systématique", () => {
    expect(
      evaluateLPS(
        inputs({
          zoneSuides: Zone.ZRIII,
          statut: Statut.MnrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
        }),
        Marque.OvaleDiagonalesParalleles,
      ),
    ).toBe(LPS.Systematique);
  });

  it("marque ovale → LPS non requis", () => {
    expect(evaluateLPS(inputs({ zoneSuides: Zone.ZoneIndemne }), Marque.Ovale)).toBe(LPS.NonRequis);
  });

  it("ZI FS + MCA abattoir + non MCA destinataire → LPS non requis", () => {
    expect(
      evaluateLPS(
        inputs({
          zoneSuides: Zone.ZIFS,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
        }),
        Marque.OvaleDiagonalesParalleles,
      ),
    ).toBe(LPS.NonRequis);
  });

  it("ZRII MR-PPA + MCA + dest non MCA en ZRI → LPS non requis", () => {
    expect(
      evaluateLPS(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
          zoneEtbDestinataire: Zone.ZRI,
        }),
        Marque.Ovale,
      ),
    ).toBe(LPS.NonRequis);
  });

  it("marque null + dest hors zone saine → LPS null", () => {
    // Mouvement interdit vers une zone réglementée stricte : pas de notion de LPS.
    expect(
      evaluateLPS(
        inputs({ zoneSuides: Zone.ZP, mcaAbattoir: false, zoneEtbDestinataire: Zone.ZRII }),
        null,
      ),
    ).toBeNull();
  });

  it("correctif : marque null + dest en zone saine → LPS non requis (explicite)", () => {
    expect(
      evaluateLPS(
        inputs({
          zoneSuides: Zone.ZP,
          mcaAbattoir: false,
          zoneEtbDestinataire: Zone.ZoneIndemne,
        }),
        null,
      ),
    ).toBe(LPS.NonRequis);
  });

  it("correctif (ex-TODO 1) : ZRII MR-PPA + MCA + dest non MCA en ZP → LPS non requis", () => {
    expect(
      evaluateLPS(
        inputs({
          zoneSuides: Zone.ZRII,
          statut: Statut.MrPpa,
          mcaAbattoir: true,
          mcaEtbDestinataire: false,
          zoneEtbDestinataire: Zone.ZP,
        }),
        Marque.OvaleDiagonalesParalleles,
      ),
    ).toBe(LPS.NonRequis);
  });
});
