import { ETABLISSEMENTS_VERSIONS, type EtablissementsOutputs } from "@engine";
import { SimulationResult } from "../../components/SimulationResult";

type Props = {
  result: EtablissementsOutputs;
};

export function EtablissementsResult({ result }: Props) {
  return (
    <SimulationResult
      result={result}
      sousTitre="Établissement du secteur alimentaire > autre établissement destinataire"
      versionCourante={ETABLISSEMENTS_VERSIONS[0]}
    />
  );
}
