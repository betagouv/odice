import { Fragment } from "react";
import { STATUT_TOOLTIP } from "@shared/labels/abattoirs.labels";
import { InfoTooltip } from "@shared/components/InfoTooltip";

// Infobulle du statut MR-PPA / MNR-PPA. <br /> plutôt que <p> : la bulle DSFR est un <span>.
export function StatutInfoTooltip() {
  return (
    <InfoTooltip>
      {STATUT_TOOLTIP.intro}
      {STATUT_TOOLTIP.statuts.map((statut) => (
        <Fragment key={statut.titre}>
          <br />
          <br />
          <strong>{statut.titre}</strong>
          <br />
          {statut.texte}
        </Fragment>
      ))}
    </InfoTooltip>
  );
}
