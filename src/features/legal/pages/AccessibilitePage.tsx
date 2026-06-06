import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

export function AccessibilitePage() {
  // TODO: rédiger la déclaration d'accessibilité conforme RGAA 4.1.2 (audit, état de conformité,
  // dérogations, voies de recours, contact référent accessibilité)
  return (
    <PageContainer>
      <PageTitle>Accessibilité</PageTitle>
      <Breadcrumb segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Accessibilité" }]} />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Déclaration d'accessibilité</h1>
          <p className="fr-text--lead">
            État de conformité : <strong>Non conforme</strong>. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>

          <h2>Résultats des tests</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor
            quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
          </p>

          <h2>Contenus non accessibles</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu libero sit amet quam
            egestas semper.
          </p>

          <h2>Établissement de cette déclaration</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies mi vitae est.
          </p>

          <h2>Voies de recours</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris placerat eleifend leo.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
