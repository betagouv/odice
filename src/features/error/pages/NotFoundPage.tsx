// Page d'erreur 404 DSFR (cf. systeme-de-design.gouv.fr/page-erreur).
// Rendue côté client par la route attrape-tout : pas de statut HTTP 404 en SPA statique.

import { Link } from "react-router-dom";
import ovoidUrl from "@gouvfr/dsfr/dist/artwork/background/ovoid.svg?url";
import technicalErrorUrl from "@gouvfr/dsfr/dist/artwork/pictograms/system/technical-error.svg?url";
import { ROUTES } from "@shared/config/routes.config";
import { PageTitle } from "@shared/components/PageTitle";

export function NotFoundPage() {
  return (
    <div className="fr-container">
      <PageTitle>Page non trouvée</PageTitle>
      <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div className="fr-py-0 fr-col-12 fr-col-md-6">
          <h1>Page non trouvée</h1>
          <p className="fr-text--sm fr-mb-3w">Erreur 404</p>
          <p className="fr-text--sm fr-mb-5w">
            La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.
          </p>
          <p className="fr-text--lead fr-mb-3w">
            Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La
            page n'est peut-être plus disponible.
            <br />
            Dans ce cas, pour continuer votre visite, vous pouvez consulter notre page d'accueil.
          </p>
          <ul className="fr-btns-group fr-btns-group--inline-md">
            <li>
              <Link className="fr-btn" to={ROUTES.HOME}>
                Page d'accueil
              </Link>
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
