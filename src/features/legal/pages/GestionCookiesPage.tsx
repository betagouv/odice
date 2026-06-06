import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

export function GestionCookiesPage() {
  // TODO: lister les cookies/traceurs utilisés (technique vs mesure d'audience), expliquer les
  // finalités, et brancher le bandeau de consentement (CNIL / tarteaucitron ou équivalent DSFR)
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
            tristique senectus et netus.
          </p>

          <h2>Qu'est-ce qu'un cookie ?</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus viverra nulla ut
            metus varius laoreet.
          </p>

          <h2>Cookies déposés sur ce site</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum. Aenean
            imperdiet. Etiam ultricies nisi vel augue.
          </p>

          <h2>Cookies techniques nécessaires</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper ultricies
            nisi.
          </p>

          <h2>Mesure d'audience</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget dui. Etiam rhoncus.
          </p>

          <h2>Gérer mes préférences</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus, tellus eget
            condimentum rhoncus.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
