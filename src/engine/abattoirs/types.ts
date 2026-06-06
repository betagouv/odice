// Types du bounded context Abattoirs.

import type {
  Certification,
  LPS,
  Marque,
  Mouvement,
  Statut,
  Traitement,
  Zone,
} from "../shared/types";

// statut est null hors {ZRII, ZRIII} (sans impact réglementaire ailleurs).
export interface AbattoirsInputs {
  zoneSuides: Zone;
  statut: Statut | null;
  zoneAbattoir: Zone;
  mcaAbattoir: boolean;
  zoneEtbDestinataire: Zone;
  mcaEtbDestinataire: boolean;
}

// marque=null ⇔ interdiction totale. Autres champs null si non applicables.
// Cf. docs/simulateur-abattoirs-points-a-valider.md (TODO 1 et 2).
export interface AbattoirsOutputs {
  marque: Marque | null;
  frMouvement: Mouvement;
  ueMouvement: Mouvement;
  frTraitement: Traitement | null;
  ueTraitement: Traitement | null;
  frDocument: LPS | null;
  ueDocument: Certification | null;
}
