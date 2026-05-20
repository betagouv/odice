import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";

export function SimulateurEtablissementsPage() {
  return (
    <PageContainer>
      <Breadcrumb
        segments={[
          { label: "Accueil", to: ROUTES.HOME },
          { label: "Simulateur", to: ROUTES.SIMULATEURS },
          { label: "Établissements" },
        ]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12">
          <h1>Simulateur Établissements</h1>
          <p className="fr-text--lead">
            Déterminez les autorisations applicables aux viandes réexpédiées par un établissement du
            secteur alimentaire (découpe, transformation, entrepôt).
          </p>

          {/* TODO: intégrer SimulatorForm et ResultPanel pour le parcours Établissements */}
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
