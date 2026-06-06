// Fonctions de validation des inputs Abattoirs.
// Aucune contrainte inter-champs (cf. points-a-valider TODO 5).

import { abattoirsInputsSchema } from "./schema";
import type { AbattoirsInputs } from "./types";

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
