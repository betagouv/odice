#!/usr/bin/env node
// Génère tests/fixtures/abattoirs/oracle-2744.json depuis le xlsx source.
// Usage : pnpm fixture:abattoirs [--check]
// Si la structure du xlsx change, le script échoue avec un message explicite.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const SOURCE_XLSX = join(REPO_ROOT, "docs/sources/abattoirs-test-formules-20260512.xlsx");
const TARGET_JSON = join(REPO_ROOT, "tests/fixtures/abattoirs/oracle-2744.json");
const SHEET_NAME = "ABATTOIRS";

// Mapping libellés xlsx → enums (cf. src/engine/types.ts).

const ZONE_MAP = Object.freeze({
  "zone indemne": "zone-indemne",
  ZP: "zp",
  ZS: "zs",
  "ZI FS": "zi-fs",
  ZRI: "zri",
  ZRII: "zrii",
  ZRIII: "zriii",
});

const STATUT_MAP = Object.freeze({
  "MR-PPA": "mr-ppa",
  "MNR-PPA": "mnr-ppa",
});

const MCA_MAP = Object.freeze({
  OUI: true,
  NON: false,
});

const MARQUE_MAP = Object.freeze({
  ovale: "ovale",
  "ovale barree": "ovale-barree",
  "ovale diagonales paralleles": "ovale-diagonales-paralleles",
});

const MOUVEMENT_MAP = Object.freeze({
  autorise: "autorise",
  interdit: "interdit",
});

const TRAITEMENT_MAP = Object.freeze({
  "Traitement d'atténuation obligatoire": "obligatoire",
  "Traitement d'atténuation non obligatoire": "non-obligatoire",
});

const LPS_MAP = Object.freeze({
  "LPS permanent": "lps-permanent",
  "LPS systématique": "lps-systematique",
  "LPS non requis": "lps-non-requis",
});

// Mapping « obligatoire » (xlsx) → « possible » (UI) — cf. points-a-valider TODO 4.
const CERTIFICATION_MAP = Object.freeze({
  "Certification zoosanitaire obligatoire": "certification-obligatoire",
  "Dérogation à la certification zoosanitaire obligatoire": "derogation-possible",
  "Certification zoosanitaire non requise": "certification-non-requise",
});

const EXPECTED_HEADERS_R0 = ["ENTREES", null, null, null, null, null, "SORTIES"];
const EXPECTED_HEADERS_R2 = [
  "zone_suides",
  "statut",
  "zone_abattoir",
  "MCA_abattoir",
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

function lookup(map, value, columnLabel) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (!Object.prototype.hasOwnProperty.call(map, value)) {
    throw new Error(
      `Valeur inconnue dans la colonne "${columnLabel}" : ${JSON.stringify(value)}\n` +
        `  Valeurs acceptées : ${Object.keys(map).join(", ")}\n` +
        `  → Mettre à jour le mapping et src/engine/types.ts.`,
    );
  }
  return map[value];
}

function assertHeader(row, expected, rowNumber) {
  for (let i = 0; i < expected.length; i += 1) {
    if (expected[i] === null) continue;
    const actual = row[i] ?? null;
    if (actual !== expected[i]) {
      throw new Error(
        `En-tête inattendu en R${rowNumber} colonne ${i + 1} :\n` +
          `  attendu : ${JSON.stringify(expected[i])}\n` +
          `  trouvé  : ${JSON.stringify(actual)}\n` +
          `  → Structure xlsx changée : adapter script et moteur.`,
      );
    }
  }
}

function buildFixture() {
  if (!existsSync(SOURCE_XLSX)) {
    throw new Error(`Fichier source introuvable : ${SOURCE_XLSX}`);
  }

  const buffer = readFileSync(SOURCE_XLSX);
  const wb = XLSX.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[SHEET_NAME];
  if (!ws) {
    throw new Error(
      `Sheet "${SHEET_NAME}" introuvable dans ${SOURCE_XLSX}. Sheets disponibles : ${wb.SheetNames.join(", ")}`,
    );
  }

  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  assertHeader(rows[0], EXPECTED_HEADERS_R0, 1);
  assertHeader(rows[2], EXPECTED_HEADERS_R2, 3);

  const dataRows = rows.slice(3);
  const fixture = [];

  for (let i = 0; i < dataRows.length; i += 1) {
    const r = dataRows[i];
    const xlsxRowNumber = i + 4;

    if (r.every((c) => c === null || c === "")) continue;

    const zoneSuides = lookup(ZONE_MAP, r[0], "zone_suides");
    const statut = lookup(STATUT_MAP, r[1], "statut");
    const zoneAbattoir = lookup(ZONE_MAP, r[2], "zone_abattoir");
    const mcaAbattoir = lookup(MCA_MAP, r[3], "MCA_abattoir");
    const zoneEtbDestinataire = lookup(ZONE_MAP, r[4], "zone_destinataire");
    const mcaEtbDestinataire = lookup(MCA_MAP, r[5], "MCA_destinataire");

    const frMouvement = lookup(MOUVEMENT_MAP, r[6], "FR_mouvement");
    const ueMouvement = lookup(MOUVEMENT_MAP, r[7], "UE_mouvement");
    const marque = lookup(MARQUE_MAP, r[8], "marque");
    const frTraitement = lookup(TRAITEMENT_MAP, r[9], "FR_traitement");
    const ueTraitement = lookup(TRAITEMENT_MAP, r[10], "UE_traitement");
    const frDocument = lookup(LPS_MAP, r[11], "FR_document");
    const ueDocument = lookup(CERTIFICATION_MAP, r[12], "UE_document");

    // Statut applicable uniquement à ZRII/ZRIII : forcé null sinon.
    const statutNormalise = zoneSuides === "zrii" || zoneSuides === "zriii" ? statut : null;

    fixture.push({
      row: xlsxRowNumber,
      description: `${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]}`,
      inputs: {
        zoneSuides,
        statut: statutNormalise,
        zoneAbattoir,
        mcaAbattoir,
        zoneEtbDestinataire,
        mcaEtbDestinataire,
      },
      expected: {
        marque,
        frMouvement,
        ueMouvement,
        frTraitement,
        ueTraitement,
        frDocument,
        ueDocument,
      },
    });
  }

  return fixture;
}

function serialize(fixture) {
  return `${JSON.stringify(fixture, null, 2)}\n`;
}

function main() {
  const checkMode = process.argv.includes("--check");

  const fixture = buildFixture();
  const serialized = serialize(fixture);

  if (checkMode) {
    if (!existsSync(TARGET_JSON)) {
      console.error(`[fixture:abattoirs --check] Fichier cible manquant : ${TARGET_JSON}`);
      console.error("Lancer `pnpm fixture:abattoirs` pour le générer.");
      process.exit(1);
    }
    const committed = readFileSync(TARGET_JSON, "utf8");
    if (committed !== serialized) {
      console.error("[fixture:abattoirs --check] La fixture committée diffère du xlsx source.");
      console.error("Lancer `pnpm fixture:abattoirs` puis commiter le diff.");
      process.exit(1);
    }
    console.info(`[fixture:abattoirs --check] OK — ${fixture.length} cas à jour.`);
    return;
  }

  writeFileSync(TARGET_JSON, serialized, "utf8");
  console.info(`[fixture:abattoirs] Écrit ${fixture.length} cas dans ${TARGET_JSON}`);
}

main();
