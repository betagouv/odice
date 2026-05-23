// Dispatcher racine. Implémentation Abattoirs dans ./abattoirs/.

import type {
  AbattoirsInputs,
  AbattoirsOutputs,
  EtablissementsInputs,
  EtablissementsOutputs,
} from "./types";

// Stub temporaire — remplacé par re-export de ./abattoirs/evaluate.
export function evaluateAbattoir(_inputs: AbattoirsInputs): AbattoirsOutputs {
  throw new Error("evaluateAbattoir: implémentation en cours");
}

export function evaluateEtablissements(_inputs: EtablissementsInputs): EtablissementsOutputs {
  throw new Error("evaluateEtablissements: simulateur non encore implémenté");
}
