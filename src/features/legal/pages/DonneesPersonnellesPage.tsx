import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

export function DonneesPersonnellesPage() {
  // TODO: rédiger la politique de protection des données (RGPD : finalités, base légale,
  // données collectées, durée de conservation, droits, DPO, recours CNIL)
  return (
    <PageContainer>
      <PageTitle>Données personnelles</PageTitle>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Données personnelles" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Données personnelles</h1>
          <p className="fr-text--lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
            tristique senectus et netus.
          </p>

          <h2>Responsable de traitement</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pede justo, fringilla
            vel, aliquet nec, vulputate eget, arcu.
          </p>

          <h2>Finalités et base légale</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In enim justo, rhoncus ut,
            imperdiet a, venenatis vitae, justo.
          </p>

          <h2>Données collectées et durée de conservation</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dictum felis eu pede
            mollis pretium.
          </p>

          <h2>Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
            d'un droit d'accès, de rectification, d'effacement, d'opposition et de portabilité de
            vos données. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <h2>Contact et recours</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tincidunt. Cras
            dapibus.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
