// Schéma Zod (data definition pure) pour les inputs Autres Établissements.

import { z } from "zod";
import { Marque, Zone } from "../shared/types";
import type { EtablissementsInputs } from "./types";

const zoneSchema = z.enum([
  Zone.ZoneIndemne,
  Zone.ZP,
  Zone.ZS,
  Zone.ZIFS,
  Zone.ZRI,
  Zone.ZRII,
  Zone.ZRIII,
]);

const marqueSchema = z.enum([Marque.Ovale, Marque.OvaleBarree, Marque.OvaleDiagonalesParalleles]);

export const etablissementsInputsSchema = z.object({
  zoneSuides: zoneSchema,
  marqueViandes: marqueSchema,
  traitementObligatoireFr: z.boolean(),
  traitementObligatoireUe: z.boolean(),
  zoneExpediteur: zoneSchema,
  mcaExpediteur: z.boolean(),
  traitementRealise: z.boolean(),
  zoneDestinataire: zoneSchema,
  mcaDestinataire: z.boolean(),
}) satisfies z.ZodType<EtablissementsInputs>;
