import { ABATTOIRS_VERSIONS, type AbattoirsInputs, type AbattoirsOutputs } from "@engine";
import { STATUT_SIGLES } from "@shared/labels/abattoirs.labels";
import { SimulationResult } from "../../components/SimulationResult";

type Props = {
  inputs: AbattoirsInputs;
  result: AbattoirsOutputs;
};

export function AbattoirsResult({ inputs, result }: Props) {
  return (
    <SimulationResult
      result={result}
      mentions={{
        zoneSuides: inputs.zoneSuides,
        statut: inputs.statut === null ? null : STATUT_SIGLES[inputs.statut],
      }}
      sousTitre="Abattoir > autre établissement du secteur alimentaire"
      versionCourante={ABATTOIRS_VERSIONS[0]}
    />
  );
}
