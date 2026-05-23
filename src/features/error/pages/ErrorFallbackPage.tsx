// Page affichée par l'ErrorBoundary quand le rendu React crashe.
// UI DSFR sobre + lien retour accueil.

import { ROUTES } from "@shared/config/routes.config";
import { PageContainer } from "@shared/components/PageContainer";

export function ErrorFallbackPage() {
  return (
    <PageContainer>
      <div className="fr-grid-row fr-grid-row--center fr-mt-6w">
        <div className="fr-col-12 fr-col-md-8">
          <div className="fr-alert fr-alert--error">
            <h3 className="fr-alert__title">Une erreur est survenue</h3>
            <p>
              Le simulateur a rencontré un problème inattendu. L'erreur a été enregistrée. Vous
              pouvez recharger la page ou revenir à l'accueil.
            </p>
          </div>

          <ul className="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
            <li>
              <button type="button" className="fr-btn" onClick={() => window.location.reload()}>
                Recharger la page
              </button>
            </li>
            <li>
              <a className="fr-btn fr-btn--secondary" href={ROUTES.HOME}>
                Retour à l'accueil
              </a>
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
