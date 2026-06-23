// Orchestrateur du bounded context Autres Établissements.
// Ordre des dépendances : marque d'abord, puis traitement (la marque en dépend),
// puis LPS (dépend de marque + traitement FR). Certification ne dépend que de la marque.

import { evaluateCertification } from "./rules/certification";
import { evaluateLPS } from "./rules/lps";
import { evaluateMarque } from "./rules/marque";
import { evaluateMouvement } from "./rules/mouvement";
import { evaluateTraitement } from "./rules/traitement";
import type { EtablissementsInputs, EtablissementsOutputs } from "./types";

export function evaluateEtablissements(inputs: EtablissementsInputs): EtablissementsOutputs {
  const marque = evaluateMarque(inputs);
  const mouvement = evaluateMouvement(marque);
  const traitement = evaluateTraitement(inputs, marque);

  return {
    marque,
    frMouvement: mouvement.fr,
    ueMouvement: mouvement.ue,
    frTraitement: traitement.fr,
    ueTraitement: traitement.ue,
    frDocument: evaluateLPS(inputs, marque, traitement.fr),
    ueDocument: evaluateCertification(inputs, marque),
  };
}
