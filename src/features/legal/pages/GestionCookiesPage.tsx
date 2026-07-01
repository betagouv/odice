import { Link } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

export function GestionCookiesPage() {
  return (
    <PageContainer>
      <PageTitle>Gestion des cookies</PageTitle>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Gestion des cookies" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Gestion des cookies</h1>
          <p className="fr-text--lead">
            ODICE ne dépose aucun cookie de suivi ni traceur publicitaire. Aucune bannière de
            consentement n'est donc nécessaire.
          </p>

          <h2>Cookies déposés sur ce site</h2>
          <p>
            ODICE est une application sans compte ni authentification. Elle ne dépose aucun cookie
            publicitaire, ni traceur tiers, ni cookie de mesure d'audience.
          </p>

          <h2>Mesure d'audience</h2>
          <p>
            La fréquentation du site est mesurée avec Matomo, hébergé par la plateforme de
            statistiques de beta.gouv, dans une configuration <strong>sans cookie</strong> : aucune
            information n'est stockée sur votre appareil à des fins de suivi. Les données
            recueillies sont anonymisées et ne permettent pas de vous réidentifier.
          </p>
          <p>
            Cette mesure d'audience est exemptée de consentement au sens de la Commission nationale
            de l'informatique et des libertés (CNIL). Vous pouvez néanmoins activer l'option « Ne
            pas me pister » (<em>Do Not Track</em>) de votre navigateur, qui est respectée.
          </p>

          <h2>En savoir plus</h2>
          <p>
            Les modalités de traitement de vos données sont détaillées dans la{" "}
            <Link className="fr-link" to={ROUTES.DONNEES_PERSONNELLES}>
              politique de protection des données
            </Link>
            .
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
