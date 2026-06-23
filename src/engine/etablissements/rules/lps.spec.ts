import { describe, expect, it } from "vitest";
import { LPS, Marque, Traitement, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";
import { evaluateLPS } from "./lps";

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

describe("evaluateLPS (etablissements)", () => {
  it("ovale barrée + expéditeur/destinataire MCA → LPS permanent", () => {
    expect(evaluateLPS(inputs(), Marque.OvaleBarree, Traitement.Obligatoire)).toBe(LPS.Permanent);
  });

  it("diagonales parallèles + traitement FR obligatoire + expéditeur MCA + destinataire non MCA → LPS systématique", () => {
    expect(
      evaluateLPS(
        inputs({ mcaExpediteur: true, mcaDestinataire: false }),
        Marque.OvaleDiagonalesParalleles,
        Traitement.Obligatoire,
      ),
    ).toBe(LPS.Systematique);
  });

  it("marque ovale → LPS non requis", () => {
    expect(evaluateLPS(inputs(), Marque.Ovale, Traitement.NonObligatoire)).toBe(LPS.NonRequis);
  });

  it("pas de marque → null", () => {
    expect(evaluateLPS(inputs({ zoneSuides: Zone.ZP }), null, null)).toBeNull();
  });
});
