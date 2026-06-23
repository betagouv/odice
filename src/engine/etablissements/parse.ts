// Fonctions de validation des inputs Autres Établissements.
// Aucune contrainte inter-champs (cf. abattoirs/parse.ts, même politique).

import { etablissementsInputsSchema } from "./schema";
import type { EtablissementsInputs } from "./types";

// Throw ZodError si invalide.
export function parseEtablissementsInputs(raw: unknown): EtablissementsInputs {
  return etablissementsInputsSchema.parse(raw);
}

// Variante non-throw.
export function safeParseEtablissementsInputs(
  raw: unknown,
): ReturnType<typeof etablissementsInputsSchema.safeParse> {
  return etablissementsInputsSchema.safeParse(raw);
}
