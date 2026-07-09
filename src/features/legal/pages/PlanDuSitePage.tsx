import { Link } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

export function PlanDuSitePage() {
  return (
    <PageContainer>
      <PageTitle>Plan du site</PageTitle>
      <Breadcrumb segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Plan du site" }]} />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Plan du site</h1>
          <p className="fr-text--lead">
            Retrouvez l'ensemble des pages du site Odicé, organisées par thématique.
          </p>

          <h2>Pages principales</h2>
          <ul>
            <li>
              <Link to={ROUTES.HOME}>Accueil</Link>
            </li>
            <li>
              <Link to={ROUTES.SIMULATEURS}>Simulateur</Link>
            </li>
            <li>
              <Link to={ROUTES.DOCUMENTATION_REGLEMENTAIRE}>Documentation réglementaire</Link>
            </li>
            <li>
              <Link to={ROUTES.AIDE_UTILISATION}>Aide à l'utilisation</Link>
            </li>
            <li>
              <Link to={ROUTES.HISTORIQUE_VERSIONS}>Historique des versions</Link>
            </li>
          </ul>

          <h2>Informations légales</h2>
          <ul>
            <li>
              <Link to={ROUTES.ACCESSIBILITE}>Accessibilité</Link>
            </li>
            <li>
              <Link to={ROUTES.MENTIONS_LEGALES}>Mentions légales</Link>
            </li>
            <li>
              <Link to={ROUTES.DONNEES_PERSONNELLES}>Données personnelles</Link>
            </li>
            <li>
              <Link to={ROUTES.GESTION_COOKIES}>Gestion des cookies</Link>
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
