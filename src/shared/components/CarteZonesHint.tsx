import { CARTE_ZONES_URL } from "@shared/config/external-links";
import { useMatomo, MATOMO_ANNEXES } from "@shared/analytics";

// Indice DSFR « Voir carte pour localisation » sous les champs de zone d'établissement.
export function CarteZonesHint() {
  const { trackEvent } = useMatomo();
  return (
    <span className="fr-hint-text">
      Voir{" "}
      <a
        href={CARTE_ZONES_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent(MATOMO_ANNEXES.CARTE_ZONES)}
      >
        carte
      </a>{" "}
      pour localisation
    </span>
  );
}
