import { CARTE_ZONES_URL } from "@shared/config/external-links";

// Indice DSFR « Voir carte pour localisation » sous les champs de zone d'établissement.
export function CarteZonesHint() {
  return (
    <span className="fr-hint-text">
      Voir{" "}
      <a href={CARTE_ZONES_URL} target="_blank" rel="noopener noreferrer">
        carte
      </a>{" "}
      pour localisation
    </span>
  );
}
