// Test oracle : confronte le moteur aux 32 928 cas du test xlsx fourni par l'équipe.
// À cette échelle, on agrège les écarts dans un seul test (au lieu d'un it.each
// par cas) pour garder une sortie lisible — cf. ADR-0006.

import { describe, expect, it } from "vitest";
import oracleRaw from "../../../tests/fixtures/etablissements/oracle-32928.json";
import { Marque, Zone } from "../shared/types";
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

// Correctif métier 2026-10-08 : ovale en entrée, expéditeur réglementé agréé MCA, destinataire
// réglementé non agréé. Le xlsx ne donne aucune marque pour ces cas (trou de la formule) ;
// pour ZP / ZS, la formule exige toujours le traitement réalisé (cf. rules/marque.ts).
const ZONES_REGLEMENTEES: string[] = [Zone.ZIFS, Zone.ZP, Zone.ZS, Zone.ZRII, Zone.ZRIII];
const ZONES_ORIGINE_LIBRES: Zone[] = [Zone.ZIFS, Zone.ZRII, Zone.ZRIII];
const ZONES_ORIGINE_PROTECTION: Zone[] = [Zone.ZP, Zone.ZS];
function estCorrectionMetier(i: EtablissementsInputs): boolean {
  const origine =
    ZONES_ORIGINE_LIBRES.includes(i.zoneSuides) ||
    (ZONES_ORIGINE_PROTECTION.includes(i.zoneSuides) && i.traitementRealise);
  return (
    origine &&
    i.marqueViandes === Marque.Ovale &&
    ZONES_REGLEMENTEES.includes(i.zoneExpediteur) &&
    i.mcaExpediteur &&
    ZONES_REGLEMENTEES.includes(i.zoneDestinataire) &&
    !i.mcaDestinataire
  );
}

// Entrées réellement produites par le formulaire pour une ovale (cf. traitementRegles.ts, ADR-0016).
function accessibleDepuisLeFormulaire(i: EtablissementsInputs): boolean {
  const protection = i.zoneSuides === Zone.ZP || i.zoneSuides === Zone.ZS;
  return protection
    ? i.traitementObligatoireFr && i.traitementObligatoireUe && i.traitementRealise
    : !i.traitementObligatoireFr && !i.traitementObligatoireUe && !i.traitementRealise;
}

describe("evaluateEtablissements — oracle (32 928 cas)", () => {
  it("la fixture contient exactement 32 928 cas", () => {
    expect(oracle.cases).toHaveLength(32928);
    expect(oracle.meta.count).toBe(32928);
  });

  it("reproduit fidèlement les cas de l'oracle xlsx hors correctif métier", () => {
    const mismatches: string[] = [];

    for (let i = 0; i < oracle.cases.length; i += 1) {
      const [inputTuple, outputTuple] = oracle.cases[i];
      const inputs = toInputs(inputTuple);
      if (estCorrectionMetier(inputs)) continue;
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

  describe("correctif métier 2026-10-08", () => {
    const corriges = oracle.cases
      .map(([entree, sortie]) => ({ inputs: toInputs(entree), xlsx: toOutputs(sortie) }))
      .filter(({ inputs }) => estCorrectionMetier(inputs));

    it("concerne 800 cas de l'oracle", () => {
      expect(corriges).toHaveLength(800);
    });

    it("ne comble que des trous du xlsx (aucune marque attendue)", () => {
      expect(corriges.every(({ xlsx }) => xlsx.marque === null)).toBe(true);
    });

    it("donne diagonales parallèles, France autorisé, UE interdit", () => {
      for (const { inputs } of corriges) {
        const sortie = evaluateEtablissements(inputs);
        expect(sortie.marque).toBe(Marque.OvaleDiagonalesParalleles);
        expect(sortie.frMouvement).toBe("autorise");
        expect(sortie.ueMouvement).toBe("interdit");
      }
    });

    it("côté formulaire : traitement France non obligatoire, LPS non requis", () => {
      const reachable = corriges.filter(({ inputs }) => accessibleDepuisLeFormulaire(inputs));
      expect(reachable.length).toBeGreaterThan(0);
      for (const { inputs } of reachable) {
        const sortie = evaluateEtablissements(inputs);
        expect(sortie.frTraitement).toBe("non-obligatoire");
        expect(sortie.frDocument).toBe("lps-non-requis");
      }
    });
  });
});
