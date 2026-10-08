import { ABATTOIRS_VERSIONS, type AbattoirsInputs, type AbattoirsOutputs } from "@engine";
import { STATUT_SIGLES } from "@shared/labels/abattoirs.labels";
import type { ZoneChoix } from "@shared/labels/common.labels";
import { useMatomo, matomoAction, MATOMO_SIMULATEURS, MATOMO_STEPS } from "@shared/analytics";
import { SimulationResult } from "../../components/SimulationResult";
import { exportAbattoirs } from "../../export/simulationExport";

type Props = {
  inputs: AbattoirsInputs;
  // Zone d'origine telle que choisie (« ZI FS réflexe » distinguée de ZI FS pour les mentions).
  zoneSuidesChoix: ZoneChoix;
  result: AbattoirsOutputs;
};

export function AbattoirsResult({ inputs, zoneSuidesChoix, result }: Props) {
  const { trackEvent } = useMatomo();
  const versionCourante = ABATTOIRS_VERSIONS[0];
  return (
    <SimulationResult
      result={result}
      mentions={{
        zoneSuides: zoneSuidesChoix,
        statut: inputs.statut === null ? null : STATUT_SIGLES[inputs.statut],
      }}
      sousTitre="Abattoir > autre établissement du secteur alimentaire"
      versionCourante={versionCourante}
      construireExport={(date) => exportAbattoirs(inputs, result, versionCourante, date)}
      onExport={() => trackEvent(matomoAction(MATOMO_SIMULATEURS.ABATTOIRS, MATOMO_STEPS.EXPORT))}
    />
  );
}
