import { describe, expect, it } from "vitest";
import { Certification, Marque, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";
import { evaluateCertification } from "./certification";

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

describe("evaluateCertification (etablissements)", () => {
  it("marque autre qu'ovale → null", () => {
    expect(evaluateCertification(inputs(), Marque.OvaleBarree)).toBeNull();
    expect(evaluateCertification(inputs(), null)).toBeNull();
  });

  it("ovale + expéditeur en ZP/ZS/ZI FS → certification obligatoire", () => {
    expect(evaluateCertification(inputs({ zoneExpediteur: Zone.ZP }), Marque.Ovale)).toBe(
      Certification.Obligatoire,
    );
  });

  it("ovale + suidés sains + expéditeur ZRI/ZRII/ZRIII non MCA → dérogation possible", () => {
    expect(
      evaluateCertification(
        inputs({ zoneSuides: Zone.ZRI, zoneExpediteur: Zone.ZRII, mcaExpediteur: false }),
        Marque.Ovale,
      ),
    ).toBe(Certification.DerogationPossible);
  });

  it("ovale + expéditeur en zone indemne → certification non requise", () => {
    expect(evaluateCertification(inputs({ zoneExpediteur: Zone.ZoneIndemne }), Marque.Ovale)).toBe(
      Certification.NonRequise,
    );
  });
});
