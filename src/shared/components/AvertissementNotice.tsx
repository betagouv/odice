import { Notice } from "./Notice";

// Avertissement légal commun (accueil + simulateurs) : aide à la décision indicative,
// dérogations soumises à l'appréciation de la DDecPP.
export function AvertissementNotice() {
  return (
    <Notice title="Avertissement" variant="warning">
      Cet outil est une aide à la décision fournie <strong>à titre indicatif</strong> et ne peut en
      aucun cas se substituer à la consultation des textes réglementaires en vigueur. Malgré nos
      efforts pour assurer l'exactitude des informations, leur exhaustivité et leur mise à jour ne
      peuvent être garanties.{" "}
      <strong>
        Il appartient à l'utilisateur de vérifier la conformité des résultats obtenus avant toute
        prise de décision.
      </strong>{" "}
      En conséquence, nous déclinons toute responsabilité en cas d'erreur, d'omission ou
      d'interprétation incorrecte des informations fournies par cet outil.
      {/* Saut de paragraphe : la description DSFR est un <span>, un <p> y serait invalide. */}
      <br />
      <br />
      Les possibilités de dérogation aux interdictions de mouvements présentées dans les résultats
      d'ODICE sont soumises à l'appréciation de la direction départementale en charge de la
      protection des populations (DDecPP) compétente. La DDecPP peut, au regard de la situation
      sanitaire et de l'analyse de risques réalisée, interdire le mouvement, même lorsque celui-ci
      entre dans le cadre d'une dérogation réglementaire.
    </Notice>
  );
}
