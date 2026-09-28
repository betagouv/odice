import { useId, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Infobulle DSFR (bouton « ? » + bulle au survol/focus), animée par le JS DSFR.
// Doc : https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/infobulle
export function InfoTooltip({ children }: Props) {
  const tooltipId = useId();
  return (
    <>
      <button
        type="button"
        className="fr-btn--tooltip fr-btn"
        aria-describedby={tooltipId}
        // Le bouton est souvent dans un <label> : on évite le focus du champ associé au clic.
        onClick={(e) => e.preventDefault()}
      >
        Information contextuelle
      </button>
      <span className="fr-tooltip fr-placement" id={tooltipId} role="tooltip" aria-hidden="true">
        {children}
      </span>
    </>
  );
}
