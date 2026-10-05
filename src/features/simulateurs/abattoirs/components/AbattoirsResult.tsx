import { ABATTOIRS_VERSIONS, type AbattoirsOutputs } from "@engine";
import { SimulationResult } from "../../components/SimulationResult";

type Props = {
  result: AbattoirsOutputs;
};

export function AbattoirsResult({ result }: Props) {
  return (
    <SimulationResult
      result={result}
      sousTitre="Abattoir > autre établissement du secteur alimentaire"
      versionCourante={ABATTOIRS_VERSIONS[0]}
    />
  );
}
