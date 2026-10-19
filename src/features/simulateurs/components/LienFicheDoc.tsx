import { Link } from "react-router-dom";
import type { Fiche } from "@features/documentation/fiches";

type Props = {
  fiche: Fiche;
  ancre?: string;
};

// Bouton « ? » des simulateurs : un lien vers la fiche, en nouvel onglet pour garder la saisie,
// et non une infobulle DSFR (pas de bulle au clic, cf. maquette).
export function LienFicheDoc({ fiche, ancre }: Props) {
  const libelle = `Consulter la fiche « ${fiche.titre} » - nouvelle fenêtre`;
  return (
    <Link
      to={ancre ? `${fiche.route}#${ancre}` : fiche.route}
      target="_blank"
      rel="noopener noreferrer"
      // Le DSFR élargit les liens « nouvel onglet » et leur ajoute une icône : on garde le « ? » seul,
      // la mention « nouvelle fenêtre » restant dans l'intitulé et le title.
      className="fr-btn--tooltip fr-btn max-w-8! overflow-hidden! after:hidden!"
      title={libelle}
    >
      {libelle}
    </Link>
  );
}
