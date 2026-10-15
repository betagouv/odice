import { useState } from "react";
import { reportError } from "@shared/monitoring/error-reporter";
import type { SimulationExport } from "./simulationExport";
import { telechargerPdf } from "./telechargerPdf";

type Props = {
  // Construit au clic : la date d'export est celle du téléchargement.
  construireExport: (date: Date) => SimulationExport;
  onExport?: () => void;
};

export function ExportSimulationButton({ construireExport, onExport }: Props) {
  const [enCours, setEnCours] = useState(false);
  const [echec, setEchec] = useState(false);

  async function exporter() {
    setEnCours(true);
    setEchec(false);
    onExport?.();
    try {
      await telechargerPdf(construireExport(new Date()));
    } catch (error) {
      setEchec(true);
      reportError(error, { source: "export-pdf" });
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="fr-mt-4w flex flex-col items-center">
      <button
        type="button"
        className="fr-btn fr-icon-download-line fr-btn--icon-left"
        disabled={enCours}
        onClick={() => void exporter()}
      >
        {enCours ? "Export en cours…" : "Exporter la simulation"}
      </button>
      {echec && (
        <p className="fr-error-text" role="alert">
          L'export a échoué. Veuillez réessayer.
        </p>
      )}
    </div>
  );
}
