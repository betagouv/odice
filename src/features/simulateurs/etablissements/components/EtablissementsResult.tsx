import {
  ETABLISSEMENTS_VERSIONS,
  type EtablissementsInputs,
  type EtablissementsOutputs,
} from "@engine";
import { SimulationResult } from "../../components/SimulationResult";

type Props = {
  inputs: EtablissementsInputs;
  result: EtablissementsOutputs;
};

// Pas de statut dans ce simulateur : la ligne correspondante n'est pas affichée.
export function EtablissementsResult({ inputs, result }: Props) {
  return (
    <SimulationResult
      result={result}
      mentions={{ zoneSuides: inputs.zoneSuides, statut: null }}
      sousTitre="Établissement du secteur alimentaire > autre établissement destinataire"
      versionCourante={ETABLISSEMENTS_VERSIONS[0]}
    />
  );
}
