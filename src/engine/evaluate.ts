import type { SimulateurInput, SimulateurResult } from "./types";
import { applyRules } from "./rules";

/**
 * Point d'entrée du moteur ODICE.
 *
 * Prend les inputs d'un simulateur (Abattoirs ou Établissements) et renvoie
 * le résultat réglementaire associé.
 */
export function evaluate(input: SimulateurInput): SimulateurResult {
  return applyRules(input);
}
