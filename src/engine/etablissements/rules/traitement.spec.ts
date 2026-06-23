import { describe, expect, it } from "vitest";
import { Marque, Traitement, Zone } from "../../shared/types";
import type { EtablissementsInputs } from "../types";
import { evaluateTraitement } from "./traitement";

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

describe("evaluateTraitement (etablissements)", () => {
  it("ZP + marque sortie ovale barrée → FR obligatoire ; UE obligatoire", () => {
    const r = evaluateTraitement(inputs({ zoneSuides: Zone.ZP }), Marque.OvaleBarree);
    expect(r.fr).toBe(Traitement.Obligatoire);
    expect(r.ue).toBe(Traitement.Obligatoire);
  });

  it("marque sortie ovale → FR et UE non obligatoires", () => {
    const r = evaluateTraitement(inputs(), Marque.Ovale);
    expect(r.fr).toBe(Traitement.NonObligatoire);
    expect(r.ue).toBe(Traitement.NonObligatoire);
  });

  it("marque sortie diagonales parallèles → UE non applicable (null)", () => {
    const r = evaluateTraitement(
      inputs({ zoneSuides: Zone.ZIFS }),
      Marque.OvaleDiagonalesParalleles,
    );
    expect(r.ue).toBeNull();
  });

  it("pas de marque + traitement non obligatoire FR → FR non obligatoire", () => {
    const r = evaluateTraitement(inputs({ traitementObligatoireFr: false }), null);
    expect(r.fr).toBe(Traitement.NonObligatoire);
    expect(r.ue).toBeNull();
  });
});
