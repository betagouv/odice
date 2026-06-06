// Schéma Zod (data definition pure) pour les inputs Abattoirs.

import { z } from "zod";
import { Statut, Zone } from "../shared/types";
import type { AbattoirsInputs } from "./types";

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
