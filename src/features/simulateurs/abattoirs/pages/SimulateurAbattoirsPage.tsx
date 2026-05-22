import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";

export function SimulateurAbattoirsPage() {
  return (
    <PageContainer>
      <Breadcrumb
        segments={[
          { label: "Accueil", to: ROUTES.HOME },
          { label: "Simulateur", to: ROUTES.SIMULATEURS },
          { label: "Abattoirs" },
        ]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12">
          <h1>Simulateur Abattoirs</h1>
          <p className="fr-text--lead">
            Déterminez les autorisations applicables aux viandes expédiées par votre abattoir en
            fonction de la zone d'origine des suidés et du statut sanitaire.
          </p>

          {/* TODO: intégrer SimulatorForm et ResultPanel pour le parcours Abattoirs */}
          <div className="fr-callout fr-mt-4w">
            <p className="fr-callout__title">Simulateur en cours de développement</p>
            <p className="fr-callout__text">
              Le formulaire et le moteur de règles seront intégrés dans une prochaine itération.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
