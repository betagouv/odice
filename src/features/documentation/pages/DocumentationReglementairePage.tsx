import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";

export function DocumentationReglementairePage() {
  // TODO: rédiger / référencer la documentation réglementaire PPA (instructions techniques,
  // arrêtés, règlements UE applicables) avec liens vers Légifrance et FranceAgriMer.
  return (
    <PageContainer>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Documentation réglementaire" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Documentation réglementaire</h1>
          <p className="fr-text--lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Référentiels et textes
            réglementaires applicables aux mouvements de viandes en contexte de Peste Porcine
            Africaine.
          </p>

          <h2>Textes de référence</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas.
          </p>

          <h2>Règlements de l'Union européenne</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tortor quam, feugiat
            vitae, ultricies eget, tempor sit amet, ante.
          </p>

          <h2>Instructions techniques DGAL</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu libero sit amet quam
            egestas semper.
          </p>

          <h2>Arrêtés ministériels</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies mi vitae est.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
