// Schémas Zod pour valider les inputs avant évaluation.
// Workflow : parseAbattoirsInputs(formData) → evaluateAbattoir(parsed).
// Aucune contrainte inter-champs (cf. points-a-valider TODO 5).

import { z } from "zod";
import { Statut, Zone, type AbattoirsInputs } from "./types";

const zoneSchema = z.enum([
  Zone.ZoneIndemne,
  Zone.ZP,
  Zone.ZS,
  Zone.ZIFS,
  Zone.ZRI,
  Zone.ZRII,
  Zone.ZRIII,
]);

const statutSchema = z.enum([Statut.MrPpa, Statut.MnrPpa]);

export const abattoirsInputsSchema = z.object({
  zoneSuides: zoneSchema,
  statut: statutSchema.nullable(),
  zoneAbattoir: zoneSchema,
  mcaAbattoir: z.boolean(),
  zoneEtbDestinataire: zoneSchema,
  mcaEtbDestinataire: z.boolean(),
}) satisfies z.ZodType<AbattoirsInputs>;

// Throw ZodError si invalide.
export function parseAbattoirsInputs(raw: unknown): AbattoirsInputs {
  return abattoirsInputsSchema.parse(raw);
}

// Variante non-throw.
export function safeParseAbattoirsInputs(
  raw: unknown,
): ReturnType<typeof abattoirsInputsSchema.safeParse> {
  return abattoirsInputsSchema.safeParse(raw);
}
