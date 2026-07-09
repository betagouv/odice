import { Notice } from "./Notice";

// Avertissement légal commun (simulateurs + aide à l'utilisation) : Odicé est une
// aide à la décision indicative, sans valeur réglementaire.
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
    </Notice>
  );
}
