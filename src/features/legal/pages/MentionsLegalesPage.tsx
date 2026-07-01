import { Link } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

// TODO: confirmer avant mise en ligne l'entité éditrice exacte, le directeur de la
// publication et les coordonnées de contact (cf. équipe ODICE / DGAL).
export function MentionsLegalesPage() {
  return (
    <PageContainer>
      <PageTitle>Mentions légales</PageTitle>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Mentions légales" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Mentions légales</h1>
          <p className="fr-text--lead">Dernière mise à jour : 1er juillet 2026.</p>

          <h2>Éditeur</h2>
          <p>
            ODICE est édité par la Direction générale de l'alimentation (DGAL) du ministère de
            l'Agriculture et de la Souveraineté alimentaire, 251 rue de Vaugirard, 75732 Paris Cedex
            15.
          </p>
          <p>
            Le service est développé dans le cadre du programme beta.gouv de la Direction
            interministérielle du numérique (DINUM).
          </p>

          <h2>Directeur de la publication</h2>
          <p>Le directeur de la publication est le Directeur général de l'alimentation.</p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Scalingo SAS, 3 place de Haguenau, 67000 Strasbourg, France. Les
            données sont hébergées au sein de l'Union européenne.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative au service, vous pouvez écrire à l'équipe ODICE via les
            coordonnées indiquées sur le site du ministère de l'Agriculture et de la Souveraineté
            alimentaire.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus
            de ce site sont proposés sous licence Etalab 2.0.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les modalités de traitement des données à caractère personnel sont décrites dans la{" "}
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
