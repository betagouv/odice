// Génère le PDF dans le navigateur puis le télécharge. react-pdf (~500 ko) n'est
// chargé qu'au premier export pour ne pas alourdir l'ouverture du simulateur (ADR-0017).

import type { SimulationExport } from "./simulationExport";

export async function telechargerPdf(modele: SimulationExport): Promise<void> {
  const [{ pdf }, { SimulationPdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./SimulationPdf"),
  ]);
  const blob = await pdf(
    <SimulationPdf modele={modele} origine={window.location.origin} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = modele.nomFichier;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  // Révocation différée : certains navigateurs lisent l'URL après le clic.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
