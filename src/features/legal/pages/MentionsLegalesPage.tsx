import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";

export function MentionsLegalesPage() {
  // TODO: rédiger les mentions légales (éditeur, directeur de publication, hébergeur,
  // propriété intellectuelle, contact)
  return (
    <PageContainer>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Mentions légales" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Mentions légales</h1>
          <p className="fr-text--lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
            tristique senectus et netus et malesuada.
          </p>

          <h2>Éditeur du site</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget
            dolor. Aenean massa.
          </p>

          <h2>Directeur de la publication</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum sociis natoque penatibus et
            magnis dis parturient montes.
          </p>

          <h2>Hébergeur</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quam felis, ultricies
            nec, pellentesque eu, pretium quis, sem.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla consequat massa quis
            enim.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
