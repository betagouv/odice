#!/usr/bin/env node
// Génère tests/fixtures/abattoirs/oracle-2744.json depuis le xlsx source.
// Usage : pnpm fixture:abattoirs [--check]
// Lancé via `node` natif (strip-types Node 24+), aucune dépendance ajoutée.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import {
  Certification,
  LPS,
  Marque,
  Mouvement,
  Statut,
  Traitement,
  Zone,
} from "../src/engine/shared/types.ts";
import type { AbattoirsInputs, AbattoirsOutputs } from "../src/engine/abattoirs/types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const SOURCE_XLSX = join(REPO_ROOT, "docs/sources/abattoirs-test-formules-20260605.xlsx");
const TARGET_JSON = join(REPO_ROOT, "tests/fixtures/abattoirs/oracle-2744.json");
const SHEET_NAME = "ABATTOIRS";

// Mapping libellés xlsx → enums (cf. src/engine/shared/types.ts).

const ZONE_MAP: Record<string, Zone> = {
  "zone indemne": Zone.ZoneIndemne,
  ZP: Zone.ZP,
  ZS: Zone.ZS,
  "ZI FS": Zone.ZIFS,
  ZRI: Zone.ZRI,
  ZRII: Zone.ZRII,
  ZRIII: Zone.ZRIII,
};

const STATUT_MAP: Record<string, Statut> = {
  "MR-PPA": Statut.MrPpa,
  "MNR-PPA": Statut.MnrPpa,
};

const MCA_MAP: Record<string, boolean> = {
  OUI: true,
  NON: false,
};

const MARQUE_MAP: Record<string, Marque> = {
  ovale: Marque.Ovale,
  "ovale barree": Marque.OvaleBarree,
  "ovale diagonales paralleles": Marque.OvaleDiagonalesParalleles,
};

const MOUVEMENT_MAP: Record<string, Mouvement> = {
  autorise: Mouvement.Autorise,
  interdit: Mouvement.Interdit,
};

const TRAITEMENT_MAP: Record<string, Traitement> = {
  "Traitement d'atténuation obligatoire": Traitement.Obligatoire,
  "Traitement d'atténuation non obligatoire": Traitement.NonObligatoire,
};

const LPS_MAP: Record<string, LPS> = {
  "LPS permanent": LPS.Permanent,
  "LPS systématique": LPS.Systematique,
  "LPS non requis": LPS.NonRequis,
};

// Mapping « obligatoire » (xlsx) → « possible » (UI) — cf. points-a-valider TODO 4.
// Correctif du 2026-06-05 : le libellé "Dérogation … possible" remplace
// "… obligatoire" dans le xlsx. Les deux sont acceptés ici pour permettre
// de re-générer l'oracle depuis l'ancien xlsx en cas de besoin (cf. ADR
// versionnage).
const CERTIFICATION_MAP: Record<string, Certification> = {
  "Certification zoosanitaire obligatoire": Certification.Obligatoire,
  "Dérogation à la certification zoosanitaire possible": Certification.DerogationPossible,
  "Dérogation à la certification zoosanitaire obligatoire": Certification.DerogationPossible,
  "Certification zoosanitaire non requise": Certification.NonRequise,
};

const EXPECTED_HEADERS_R0: (string | null)[] = ["ENTREES", null, null, null, null, null, "SORTIES"];
const EXPECTED_HEADERS_R2: string[] = [
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

function lookup<T>(map: Record<string, T>, value: unknown, columnLabel: string): T | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const key = String(value);
  if (!Object.prototype.hasOwnProperty.call(map, key)) {
    throw new Error(
      `Valeur inconnue dans la colonne "${columnLabel}" : ${JSON.stringify(value)}\n` +
        `  Valeurs acceptées : ${Object.keys(map).join(", ")}\n` +
        `  → Mettre à jour le mapping et src/engine/shared/types.ts.`,
    );
  }
  return map[key];
}

function assertHeader(row: unknown[], expected: (string | null)[], rowNumber: number): void {
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

interface FixtureCase {
  row: number;
  description: string;
  inputs: AbattoirsInputs;
  expected: AbattoirsOutputs;
}

function buildFixture(): FixtureCase[] {
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

  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    defval: null,
  });

  assertHeader(rows[0], EXPECTED_HEADERS_R0, 1);
  assertHeader(rows[2], EXPECTED_HEADERS_R2, 3);

  const dataRows = rows.slice(3);
  const fixture: FixtureCase[] = [];

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

    if (
      zoneSuides === null ||
      zoneAbattoir === null ||
      mcaAbattoir === null ||
      zoneEtbDestinataire === null ||
      mcaEtbDestinataire === null ||
      frMouvement === null ||
      ueMouvement === null
    ) {
      throw new Error(`Ligne xlsx ${xlsxRowNumber} : entrée ou sortie obligatoire manquante.`);
    }

    // Statut applicable uniquement à ZRII/ZRIII : forcé null sinon.
    const statutNormalise = zoneSuides === Zone.ZRII || zoneSuides === Zone.ZRIII ? statut : null;

    fixture.push({
      row: xlsxRowNumber,
      description: `${String(r[0])} | ${String(r[1])} | ${String(r[2])} | ${String(r[3])} | ${String(r[4])} | ${String(r[5])}`,
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

function serialize(fixture: FixtureCase[]): string {
  return `${JSON.stringify(fixture, null, 2)}\n`;
}

function main(): void {
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
