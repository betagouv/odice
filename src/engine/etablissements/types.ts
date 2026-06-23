// Types du bounded context Autres Établissements.
// Source : docs/sources/etablissements-test-formules-20260623.xlsx + formules-20260623.docx

import type { Certification, LPS, Marque, Mouvement, Traitement, Zone } from "../shared/types";

// 9 entrées. Contrairement aux abattoirs, la marque des viandes reçues est une
// ENTRÉE (marqueViandes) : l'établissement réexpédie de la viande déjà marquée.
export interface EtablissementsInputs {
  zoneSuides: Zone;
  marqueViandes: Marque;
  traitementObligatoireFr: boolean;
  traitementObligatoireUe: boolean;
  zoneExpediteur: Zone;
  mcaExpediteur: boolean;
  traitementRealise: boolean;
  zoneDestinataire: Zone;
  mcaDestinataire: boolean;
}

// marque=null ⇔ interdiction totale. Autres champs null si non applicables.
// Structure identique aux AbattoirsOutputs.
export interface EtablissementsOutputs {
  marque: Marque | null;
  frMouvement: Mouvement;
  ueMouvement: Mouvement;
  frTraitement: Traitement | null;
  ueTraitement: Traitement | null;
  frDocument: LPS | null;
  ueDocument: Certification | null;
}
