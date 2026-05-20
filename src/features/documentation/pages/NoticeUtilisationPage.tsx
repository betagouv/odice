import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";

export function NoticeUtilisationPage() {
  // TODO: rédiger la notice utilisateur : qui peut utiliser Odicé, comment lire un résultat,
  // limites d'usage, contact en cas de doute.
  return (
    <PageContainer>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Notice d'utilisation" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Notice d'utilisation</h1>
          <p className="fr-text--lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cette notice explique comment
            utiliser les simulateurs Odicé et interpréter les résultats.
          </p>

          <h2>À qui s'adresse Odicé ?</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
            tristique senectus.
          </p>

          <h2>Comment utiliser un simulateur</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tortor quam, feugiat
            vitae, ultricies eget, tempor sit amet, ante.
          </p>

          <h2>Comment lire un résultat</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu libero sit amet quam
            egestas semper.
          </p>

          <h2>Limites et avertissements</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odicé est un outil d'aide à la
            décision et ne se substitue pas à la consultation des textes réglementaires en vigueur.
          </p>

          <h2>Contact en cas de doute</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. En cas de doute sur
            l'interprétation d'un résultat, contacter votre DDPP de rattachement.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
