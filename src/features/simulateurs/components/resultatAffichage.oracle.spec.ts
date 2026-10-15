// Garde-fous sur les deux oracles : les règles d'affichage reposent sur des invariants
// des moteurs (cf. ADR-0015), à revérifier à chaque nouvelle version réglementaire.

import { describe, expect, it } from "vitest";
import { Marque, Mouvement } from "@engine";
import abattoirsOracleRaw from "../../../../tests/fixtures/abattoirs/oracle-2744.json";
import etablissementsOracleRaw from "../../../../tests/fixtures/etablissements/oracle-32928.json";
import type { SimulationOutputs } from "./SimulationResult";
import {
  mentionTraitement,
  resultatAffichage,
  ueInterditSansTraitement,
} from "./resultatAffichage";

type AbattoirsOracle = { expected: SimulationOutputs }[];
type EtablissementsOracle = {
  meta: { outputKeys: (keyof SimulationOutputs)[] };
  cases: [unknown[], unknown[]][];
};

const abattoirs = (abattoirsOracleRaw as unknown as AbattoirsOracle).map((c) => c.expected);
const etablissementsOracle = etablissementsOracleRaw as unknown as EtablissementsOracle;
const etablissements = etablissementsOracle.cases.map(
  ([, sorties]) =>
    Object.fromEntries(
      etablissementsOracle.meta.outputKeys.map((cle, i) => [cle, sorties[i]]),
    ) as unknown as SimulationOutputs,
);

const MENTIONS = [
  "obligatoire pour une mise sur le marché sur le territoire national",
  "obligatoire pour une mise sur le marché sur le territoire national et pour les échanges intracommunautaires",
  "obligatoire uniquement pour les échanges intracommunautaires",
];

describe.each([
  ["Abattoirs", abattoirs, 2744],
  ["Autres établissements", etablissements, 32928],
])("oracle %s", (_nom, sorties, total) => {
  it(`contient ${total} cas`, () => {
    expect(sorties).toHaveLength(total);
  });

  it("FR interdit ⇔ aucune marque (le masquage s'appuie dessus)", () => {
    for (const result of sorties) {
      expect(result.frMouvement === Mouvement.Interdit).toBe(result.marque === null);
    }
  });

  it("ovale barrée ⇒ UE interdit (badge « interdit sans traitement d'atténuation »)", () => {
    for (const result of sorties.filter((r) => r.marque === Marque.OvaleBarree)) {
      expect(result.ueMouvement).toBe(Mouvement.Interdit);
      expect(ueInterditSansTraitement(result)).toBe(true);
    }
  });

  it("bandeau affiché ⇔ mouvement FR autorisé", () => {
    for (const result of sorties) {
      expect(resultatAffichage(result).detailsFrance).toBe(
        result.frMouvement === Mouvement.Autorise,
      );
    }
  });

  it("aucune mention de traitement quand le mouvement UE est autorisé", () => {
    for (const result of sorties.filter((r) => r.ueMouvement === Mouvement.Autorise)) {
      expect(mentionTraitement(result)).toBeNull();
    }
  });

  it("chacune des trois mentions de la spec est atteinte", () => {
    const atteintes = new Set(
      sorties.filter((r) => r.frMouvement === Mouvement.Autorise).map((r) => mentionTraitement(r)),
    );
    for (const mention of MENTIONS) expect(atteintes).toContain(mention);
  });
});
