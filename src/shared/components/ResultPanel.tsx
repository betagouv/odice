import type { SimulateurResult } from "@engine/types";

type ResultPanelProps = {
  result: SimulateurResult | null;
};

export function ResultPanel({ result }: ResultPanelProps) {
  // TODO: afficher chaque champ du résultat avec sa source réglementaire
  if (!result) {
    return (
      <section className="fr-mt-4w">
        <p className="fr-text--lg">Aucun résultat à afficher pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="fr-mt-4w">
      <h2>Résultats</h2>
      <ul>
        <li>Marque sanitaire : {result.marqueSanitaire ?? "—"}</li>
        <li>Territoire autorisé : {result.territoireAutorise ?? "—"}</li>
        <li>LPS : {result.lps ?? "—"}</li>
        <li>Certification zoosanitaire : {result.certificationZoosanitaire ?? "—"}</li>
        <li>Traitement d'atténuation : {result.traitementAttenuation ?? "—"}</li>
      </ul>
    </section>
  );
}
