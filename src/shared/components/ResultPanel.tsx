import type { AbattoirsOutputs } from "@engine";

type ResultPanelProps = {
  result: AbattoirsOutputs | null;
};

export function ResultPanel({ result }: ResultPanelProps) {
  // TODO: refonte UI conforme à la maquette (badges colorés, 4 blocs groupés).
  // Ce composant est un placeholder technique le temps de cabler le moteur.
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
        <li>Marque : {result.marque ?? "—"}</li>
        <li>Mouvement France : {result.frMouvement}</li>
        <li>Mouvement UE : {result.ueMouvement}</li>
        <li>Traitement France : {result.frTraitement ?? "—"}</li>
        <li>Traitement UE : {result.ueTraitement ?? "—"}</li>
        <li>Document France (LPS) : {result.frDocument ?? "—"}</li>
        <li>Document UE (certification) : {result.ueDocument ?? "—"}</li>
      </ul>
    </section>
  );
}
