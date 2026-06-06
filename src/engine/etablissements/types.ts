// Types du bounded context Autres Établissements (placeholder, hors périmètre).

import type { Marque, Zone } from "../shared/types";

export interface EtablissementsInputs {
  zoneOrigine: Zone | null;
}

export interface EtablissementsOutputs {
  marque: Marque | null;
}
