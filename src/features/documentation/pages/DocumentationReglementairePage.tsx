import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

export function DocumentationReglementairePage() {
  return (
    <PageContainer>
      <PageTitle>Documentation réglementaire</PageTitle>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Documentation réglementaire" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Documentation réglementaire</h1>

          <div className="fr-callout fr-icon-information-line">
            <h2 className="fr-callout__title">Contenu en cours de rédaction</h2>
            <p className="fr-callout__text">
              Cette page rassemblera prochainement les textes réglementaires applicables aux
              mouvements de viandes en contexte de Peste Porcine Africaine.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
