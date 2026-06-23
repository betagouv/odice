#!/usr/bin/env node
// Génère tests/fixtures/etablissements/oracle-32928.json depuis le xlsx source.
// Usage : pnpm fixture:etablissements [--check]
// Lancé via `node` natif (strip-types Node 24+), aucune dépendance ajoutée.
//
// Format compact (cf. ADR-0006) : { meta, cases: [[inputs[9], outputs[7]], …] }.
// Les booléens sont encodés 1/0 ; les sorties null sont encodées null.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const SOURCE_XLSX = join(REPO_ROOT, "docs/sources/etablissements-test-formules-20260623.xlsx");
const TARGET_JSON = join(REPO_ROOT, "tests/fixtures/etablissements/oracle-32928.json");
const SHEET_NAME = "AUTRES_ETB";

// Mapping libellés xlsx → valeurs d'enum (cf. src/engine/shared/types.ts).
const ZONE_MAP: Record<string, string> = {
  "zone indemne": "zone-indemne",
  ZP: "zp",
  ZS: "zs",
  "ZI FS": "zi-fs",
  ZRI: "zri",
  ZRII: "zrii",
  ZRIII: "zriii",
};

const MARQUE_MAP: Record<string, string> = {
  ovale: "ovale",
  "ovale barree": "ovale-barree",
  "ovale diagonales paralleles": "ovale-diagonales-paralleles",
};

const MOUVEMENT_MAP: Record<string, string> = {
  autorise: "autorise",
  interdit: "interdit",
};

const TRAITEMENT_MAP: Record<string, string> = {
  "Traitement d'atténuation obligatoire": "obligatoire",
  "Traitement d'atténuation non obligatoire": "non-obligatoire",
};

const LPS_MAP: Record<string, string> = {
  "LPS permanent": "lps-permanent",
  "LPS systématique": "lps-systematique",
  "LPS non requis": "lps-non-requis",
};

const CERTIFICATION_MAP: Record<string, string> = {
  "Certification zoosanitaire obligatoire": "certification-obligatoire",
  "Dérogation à la certification zoosanitaire possible": "derogation-possible",
  "Certification zoosanitaire non requise": "certification-non-requise",
};

const INPUT_KEYS = [
  "zoneSuides",
  "marqueViandes",
  "traitementObligatoireFr",
  "traitementObligatoireUe",
  "zoneExpediteur",
  "mcaExpediteur",
  "traitementRealise",
  "zoneDestinataire",
  "mcaDestinataire",
];

const OUTPUT_KEYS = [
  "marque",
  "frMouvement",
  "ueMouvement",
  "frTraitement",
  "ueTraitement",
  "frDocument",
  "ueDocument",
];

// En-têtes attendus (ligne 3 du xlsx) — garde-fou contre un changement de structure.
const EXPECTED_HEADERS_R2 = [
  "zone_suides",
  "marque_viandes",
  "traitement_obligatoire_FR",
  "traitement_obligatoire_UE",
  "zone_expediteur",
  "MCA_expediteur",
  "traitement_realise",
  "zone_destinataire",
  "MCA_destinataire",
  "FR",
  "UE",
  "marque",
  "FR",
  "UE",
  "FR",
  "UE",
];

function req(map: Record<string, string>, value: unknown, label: string): string {
  const key = String(value);
  if (!Object.prototype.hasOwnProperty.call(map, key)) {
    throw new Error(
      `Valeur inconnue dans la colonne "${label}" : ${JSON.stringify(value)}\n` +
        `  Valeurs acceptées : ${Object.keys(map).join(", ")}`,
    );
  }
  return map[key];
}

// Sortie optionnelle : "" / null → null, sinon mappée.
function opt(map: Record<string, string>, value: unknown, label: string): string | null {
  if (value === null || value === undefined || value === "") return null;
  return req(map, value, label);
}

function bool(value: unknown, label: string): 0 | 1 {
  if (value === "OUI") return 1;
  if (value === "NON") return 0;
  throw new Error(`Valeur booléenne inattendue dans "${label}" : ${JSON.stringify(value)}`);
}

function assertHeader(row: unknown[]): void {
  for (let i = 0; i < EXPECTED_HEADERS_R2.length; i += 1) {
    const actual = row[i] ?? null;
    if (actual !== EXPECTED_HEADERS_R2[i]) {
      throw new Error(
        `En-tête inattendu en R3 colonne ${i + 1} :\n` +
          `  attendu : ${JSON.stringify(EXPECTED_HEADERS_R2[i])}\n` +
          `  trouvé  : ${JSON.stringify(actual)}\n` +
          `  → Structure xlsx changée : adapter script et moteur.`,
      );
    }
  }
}

type Fixture = {
  meta: { source: string; sheet: string; count: number; inputKeys: string[]; outputKeys: string[] };
  cases: [(string | 0 | 1)[], (string | null)[]][];
};

function buildFixture(): Fixture {
  if (!existsSync(SOURCE_XLSX)) {
    throw new Error(`Fichier source introuvable : ${SOURCE_XLSX}`);
  }

  const wb = XLSX.read(readFileSync(SOURCE_XLSX), { type: "buffer" });
  const ws = wb.Sheets[SHEET_NAME];
  if (!ws) {
    throw new Error(`Sheet "${SHEET_NAME}" introuvable. Sheets : ${wb.SheetNames.join(", ")}`);
  }

  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null });
  assertHeader(rows[2]);

  const cases: Fixture["cases"] = [];
  for (let i = 3; i < rows.length; i += 1) {
    const r = rows[i];
    if (r.every((c) => c === null || c === "")) continue;

    const inputs: (string | 0 | 1)[] = [
      req(ZONE_MAP, r[0], "zone_suides"),
      req(MARQUE_MAP, r[1], "marque_viandes"),
      bool(r[2], "traitement_obligatoire_FR"),
      bool(r[3], "traitement_obligatoire_UE"),
      req(ZONE_MAP, r[4], "zone_expediteur"),
      bool(r[5], "MCA_expediteur"),
      bool(r[6], "traitement_realise"),
      req(ZONE_MAP, r[7], "zone_destinataire"),
      bool(r[8], "MCA_destinataire"),
    ];

    const outputs: (string | null)[] = [
      opt(MARQUE_MAP, r[11], "marque"),
      req(MOUVEMENT_MAP, r[9], "FR_mouvement"),
      req(MOUVEMENT_MAP, r[10], "UE_mouvement"),
      opt(TRAITEMENT_MAP, r[12], "FR_traitement"),
      opt(TRAITEMENT_MAP, r[13], "UE_traitement"),
      opt(LPS_MAP, r[14], "FR_document"),
      opt(CERTIFICATION_MAP, r[15], "UE_document"),
    ];

    cases.push([inputs, outputs]);
  }

  return {
    meta: {
      source: "docs/sources/etablissements-test-formules-20260623.xlsx",
      sheet: SHEET_NAME,
      count: cases.length,
      inputKeys: INPUT_KEYS,
      outputKeys: OUTPUT_KEYS,
    },
    cases,
  };
}

// Sérialisation compacte : meta lisible, un cas par ligne.
function serialize(fixture: Fixture): string {
  const lines = fixture.cases.map((c) => "    " + JSON.stringify(c));
  return (
    "{\n" +
    `  "meta": ${JSON.stringify(fixture.meta)},\n` +
    `  "cases": [\n${lines.join(",\n")}\n  ]\n` +
    "}\n"
  );
}

const fixture = buildFixture();
const serialized = serialize(fixture);
const isCheck = process.argv.includes("--check");

if (isCheck) {
  const existing = existsSync(TARGET_JSON) ? readFileSync(TARGET_JSON, "utf8") : "";
  if (existing !== serialized) {
    console.error(
      "[fixture:etablissements:check] La fixture est désynchronisée du xlsx source.\n" +
        "  → Lancer `pnpm fixture:etablissements` et committer le résultat.",
    );
    process.exit(1);
  }
  console.info(`[fixture:etablissements:check] OK (${fixture.meta.count} cas).`);
} else {
  mkdirSync(dirname(TARGET_JSON), { recursive: true });
  writeFileSync(TARGET_JSON, serialized);
  console.info(`[fixture:etablissements] Écrit ${fixture.meta.count} cas dans ${TARGET_JSON}`);
}
