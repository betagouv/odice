// Sérialise les réponses d'un simulateur en une signature stable, utilisée comme
// Event Name Matomo pour classer les combinaisons les plus sélectionnées.
// L'ordre des champs est FIGÉ (= ordre des questions du formulaire) : la position
// encode la question, la valeur encode la réponse. Toute modification de l'ordre ou
// du format fragmente les agrégats Matomo. Légende : docs/matomo-funnel.md.

import type { AbattoirsInputs, EtablissementsInputs } from "@engine";

const SEPARATEUR = ">";

// Statut null (hors ZRII/ZRIII) : non applicable.
const NON_APPLICABLE = "na";

function ouiNon(value: boolean): string {
  return value ? "oui" : "non";
}

// Ordre = questions du formulaire Abattoirs (AbattoirsForm).
export function serialiseCombinaisonAbattoirs(inputs: AbattoirsInputs): string {
  return [
    inputs.zoneSuides,
    inputs.statut ?? NON_APPLICABLE,
    inputs.zoneAbattoir,
    ouiNon(inputs.mcaAbattoir),
    inputs.zoneEtbDestinataire,
    ouiNon(inputs.mcaEtbDestinataire),
  ].join(SEPARATEUR);
}

// Ordre = questions du formulaire Autres établissements (EtablissementsForm).
export function serialiseCombinaisonEtablissements(inputs: EtablissementsInputs): string {
  return [
    inputs.zoneSuides,
    inputs.marqueViandes,
    ouiNon(inputs.traitementObligatoireFr),
    ouiNon(inputs.traitementObligatoireUe),
    inputs.zoneExpediteur,
    ouiNon(inputs.mcaExpediteur),
    ouiNon(inputs.traitementRealise),
    inputs.zoneDestinataire,
    ouiNon(inputs.mcaDestinataire),
  ].join(SEPARATEUR);
}
