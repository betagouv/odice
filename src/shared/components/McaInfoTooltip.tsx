import { MCA_TOOLTIP } from "@shared/labels/common.labels";
import { InfoTooltip } from "./InfoTooltip";

// Infobulle partagée par toutes les questions « agrément zoosanitaire MCA ».
export function McaInfoTooltip() {
  return (
    <InfoTooltip>
      <strong>{MCA_TOOLTIP.titre}</strong> {MCA_TOOLTIP.texte}
    </InfoTooltip>
  );
}
