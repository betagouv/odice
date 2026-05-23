// Historique des versions du moteur de règles, lié aux arrêtés officiels.
// Lecture seule, source = src/engine/<context>/versions.ts.

import { ABATTOIRS_VERSIONS, type SimulateurVersion } from "@engine";
import { PageContainer } from "@shared/components/PageContainer";
import { formatDateIsoToLongFr } from "@shared/utils/format-date";

export function HistoriqueVersionsPage() {
  return (
    <PageContainer>
      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-10">
          <h1>Historique des versions</h1>
          <p className="fr-text--lead">
            Chaque version du simulateur correspond à un arrêté officiel. Toute évolution
            réglementaire fait l'objet d'une pull request référencée ci-dessous.
          </p>

          <h2 className="fr-h3 fr-mt-4w">Simulateur Abattoirs</h2>
          {ABATTOIRS_VERSIONS.map((v) => (
            <VersionArticle key={v.dateEffet} version={v} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

function VersionArticle({ version }: { version: SimulateurVersion }) {
  return (
    <article id={version.dateEffet} className="fr-mt-3w fr-pb-3w">
      <h3 className="fr-h5">Version du {formatDateIsoToLongFr(version.dateEffet)}</h3>

      <p>
        <strong>Arrêté :</strong>{" "}
        {version.arrete.url ? (
          <a href={version.arrete.url} target="_blank" rel="noopener noreferrer">
            {version.arrete.titre}
          </a>
        ) : (
          version.arrete.titre
        )}
        {version.arrete.reference && (
          <>
            {" "}
            <span className="fr-text--sm">({version.arrete.reference})</span>
          </>
        )}
      </p>

      <p>
        <strong>Sources :</strong>
      </p>
      <ul>
        {version.sources.map((src) => (
          <li key={src}>
            <code>{src}</code>
          </li>
        ))}
      </ul>

      <p>
        <strong>Changements :</strong>
      </p>
      <ul>
        {version.changements.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      {version.pullRequest && (
        <p>
          <a href={version.pullRequest} target="_blank" rel="noopener noreferrer">
            Voir la pull request
          </a>
        </p>
      )}

      <hr className="fr-mt-3w" />
    </article>
  );
}
