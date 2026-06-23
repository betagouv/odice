// Test oracle : confronte le moteur aux 32 928 cas du test xlsx fourni par l'équipe.
// À cette échelle, on agrège les écarts dans un seul test (au lieu d'un it.each
// par cas) pour garder une sortie lisible — cf. ADR-0006.

import { describe, expect, it } from "vitest";
import oracleRaw from "../../../tests/fixtures/etablissements/oracle-32928.json";
import { evaluateEtablissements } from "./evaluate";
import type { EtablissementsInputs, EtablissementsOutputs } from "./types";

type InputTuple = [string, string, 0 | 1, 0 | 1, string, 0 | 1, 0 | 1, string, 0 | 1];
type OutputTuple = [
  string | null,
  string,
  string,
  string | null,
  string | null,
  string | null,
  string | null,
];

interface Oracle {
  meta: { count: number; inputKeys: string[]; outputKeys: string[] };
  cases: [InputTuple, OutputTuple][];
}

const oracle = oracleRaw as unknown as Oracle;

function toInputs(t: InputTuple): EtablissementsInputs {
  return {
    zoneSuides: t[0] as EtablissementsInputs["zoneSuides"],
    marqueViandes: t[1] as EtablissementsInputs["marqueViandes"],
    traitementObligatoireFr: t[2] === 1,
    traitementObligatoireUe: t[3] === 1,
    zoneExpediteur: t[4] as EtablissementsInputs["zoneExpediteur"],
    mcaExpediteur: t[5] === 1,
    traitementRealise: t[6] === 1,
    zoneDestinataire: t[7] as EtablissementsInputs["zoneDestinataire"],
    mcaDestinataire: t[8] === 1,
  };
}

function toOutputs(t: OutputTuple): EtablissementsOutputs {
  return {
    marque: t[0] as EtablissementsOutputs["marque"],
    frMouvement: t[1] as EtablissementsOutputs["frMouvement"],
    ueMouvement: t[2] as EtablissementsOutputs["ueMouvement"],
    frTraitement: t[3] as EtablissementsOutputs["frTraitement"],
    ueTraitement: t[4] as EtablissementsOutputs["ueTraitement"],
    frDocument: t[5] as EtablissementsOutputs["frDocument"],
    ueDocument: t[6] as EtablissementsOutputs["ueDocument"],
  };
}

describe("evaluateEtablissements — oracle (32 928 cas)", () => {
  it("la fixture contient exactement 32 928 cas", () => {
    expect(oracle.cases).toHaveLength(32928);
    expect(oracle.meta.count).toBe(32928);
  });

  it("reproduit fidèlement les 32 928 cas de l'oracle xlsx", () => {
    const mismatches: string[] = [];

    for (let i = 0; i < oracle.cases.length; i += 1) {
      const [inputTuple, outputTuple] = oracle.cases[i];
      const inputs = toInputs(inputTuple);
      const expected = toOutputs(outputTuple);
      const actual = evaluateEtablissements(inputs);

      for (const key of Object.keys(expected) as (keyof EtablissementsOutputs)[]) {
        if (actual[key] !== expected[key]) {
          if (mismatches.length < 10) {
            mismatches.push(
              `xlsx ligne ${i + 4} [${inputTuple.join(", ")}] → ${key}: ` +
                `attendu ${JSON.stringify(expected[key])}, obtenu ${JSON.stringify(actual[key])}`,
            );
          }
          break;
        }
      }
    }

    if (mismatches.length > 0) {
      throw new Error(
        `${mismatches.length}+ cas divergent de l'oracle (10 premiers) :\n` + mismatches.join("\n"),
      );
    }
  });
});
