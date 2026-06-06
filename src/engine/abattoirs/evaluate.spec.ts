// Test oracle : itère sur les 2 744 cas du test xlsx fourni par l'équipe métier.
// Garantit la conformité du moteur à la spec réglementaire à 100 %.

import { describe, expect, it } from "vitest";
import oracleRaw from "../../../tests/fixtures/abattoirs/oracle-2744.json";
import { evaluateAbattoir } from "./evaluate";
import type { AbattoirsInputs, AbattoirsOutputs } from "./types";

interface OracleCase {
  row: number;
  description: string;
  inputs: AbattoirsInputs;
  expected: AbattoirsOutputs;
}

const oracle = oracleRaw as OracleCase[];

describe("evaluateAbattoir — oracle (2 744 cas)", () => {
  it("la fixture contient exactement 2 744 cas", () => {
    expect(oracle).toHaveLength(2744);
  });

  it.each(oracle)("[xlsx ligne $row] $description", ({ inputs, expected }) => {
    expect(evaluateAbattoir(inputs)).toEqual(expected);
  });
});
