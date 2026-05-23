// Page d'erreur DSFR standard (cf. systeme-de-design.gouv.fr/page-erreur).
// Wording adapté au contexte SPA (pas de serveur 500, c'est un crash client).
// Artworks DSFR chargés via Vite `?url` (pas besoin de copier dans public).

import ovoidUrl from "@gouvfr/dsfr/dist/artwork/background/ovoid.svg?url";
import technicalErrorUrl from "@gouvfr/dsfr/dist/artwork/pictograms/system/technical-error.svg?url";
import { ROUTES } from "@shared/config/routes.config";

export function ErrorFallbackPage() {
  return (
    <div className="fr-container">
      <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div className="fr-py-0 fr-col-12 fr-col-md-6">
          <h1>Erreur inattendue</h1>
          <p className="fr-text--sm fr-mb-3w">Erreur d'affichage</p>
          <p className="fr-text--sm fr-mb-5w">
            Désolé, le simulateur a rencontré un problème inattendu. L'incident a été enregistré
            dans les journaux du navigateur.
          </p>
          <p className="fr-text--lead fr-mb-3w">
            Essayez de recharger la page ou de revenir à l'accueil.
          </p>
          <ul className="fr-btns-group fr-btns-group--inline-md">
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
        <div className="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fr-responsive-img fr-artwork"
            aria-hidden="true"
            width="160"
            height="200"
            viewBox="0 0 160 200"
          >
            <use className="fr-artwork-motif" href={`${ovoidUrl}#artwork-motif`} />
            <use className="fr-artwork-background" href={`${ovoidUrl}#artwork-background`} />
            <g transform="translate(40, 60)">
              <use
                className="fr-artwork-decorative"
                href={`${technicalErrorUrl}#artwork-decorative`}
              />
              <use className="fr-artwork-minor" href={`${technicalErrorUrl}#artwork-minor`} />
              <use className="fr-artwork-major" href={`${technicalErrorUrl}#artwork-major`} />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
