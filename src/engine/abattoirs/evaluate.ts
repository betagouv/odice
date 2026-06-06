// Orchestrateur du bounded context Abattoirs.
// Dépendances entre sorties : marque est calculée en premier puis sert d'input
// aux autres règles. Cf. docs/simulateur-abattoirs.md (section 4).

import { evaluateCertification } from "./rules/certification";
import { evaluateLPS } from "./rules/lps";
import { evaluateMarque } from "./rules/marque";
import { evaluateMouvement } from "./rules/mouvement";
import { evaluateTraitement } from "./rules/traitement";
import type { AbattoirsInputs, AbattoirsOutputs } from "./types";

export function evaluateAbattoir(inputs: AbattoirsInputs): AbattoirsOutputs {
  const marque = evaluateMarque(inputs);
  const mouvement = evaluateMouvement(marque);
  const traitement = evaluateTraitement(inputs, marque);

  return {
    marque,
    frMouvement: mouvement.fr,
    ueMouvement: mouvement.ue,
    frTraitement: traitement.fr,
    ueTraitement: traitement.ue,
    frDocument: evaluateLPS(inputs, marque),
    ueDocument: evaluateCertification(inputs, marque),
  };
}
