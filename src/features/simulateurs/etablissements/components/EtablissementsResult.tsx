import {
  ETABLISSEMENTS_VERSIONS,
  type EtablissementsInputs,
  type EtablissementsOutputs,
} from "@engine";
import { useMatomo, matomoAction, MATOMO_SIMULATEURS, MATOMO_STEPS } from "@shared/analytics";
import { SimulationResult } from "../../components/SimulationResult";
import { exportEtablissements } from "../../export/simulationExport";

type Props = {
  inputs: EtablissementsInputs;
  result: EtablissementsOutputs;
  // Nom du type sélectionné (« atelier de découpe »…), repris dans l'export.
  nomEtablissement: string;
};

// Pas de statut dans ce simulateur : la ligne correspondante n'est pas affichée.
export function EtablissementsResult({ inputs, result, nomEtablissement }: Props) {
  const { trackEvent } = useMatomo();
  const versionCourante = ETABLISSEMENTS_VERSIONS[0];
  return (
    <SimulationResult
      result={result}
      mentions={{ zoneSuides: inputs.zoneSuides, statut: null }}
      sousTitre="Établissement du secteur alimentaire > autre établissement destinataire"
      versionCourante={versionCourante}
      construireExport={(date) =>
        exportEtablissements(inputs, result, versionCourante, nomEtablissement, date)
      }
      onExport={() =>
        trackEvent(matomoAction(MATOMO_SIMULATEURS.ETABLISSEMENTS, MATOMO_STEPS.EXPORT))
      }
    />
  );
}
