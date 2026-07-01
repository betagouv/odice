import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

// TODO: mettre à jour l'état de conformité et les résultats à l'issue d'un audit RGAA,
// et confirmer le contact du référent accessibilité.
export function AccessibilitePage() {
  return (
    <PageContainer>
      <PageTitle>Accessibilité</PageTitle>
      <Breadcrumb segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Accessibilité" }]} />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Déclaration d'accessibilité</h1>
          <p className="fr-text--lead">Établie le 1er juillet 2026.</p>
          <p>
            La Direction générale de l'alimentation (DGAL) s'engage à rendre ses sites internet
            accessibles conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005. Cette
            déclaration d'accessibilité s'applique au site ODICE.
          </p>

          <h2>État de conformité</h2>
          <p>
            En l'absence d'audit et dans l'attente de celui-ci, le site ODICE{" "}
            <strong>n'est pas en conformité</strong> avec le référentiel général d'amélioration de
            l'accessibilité (RGAA). Les non-conformités éventuelles n'ont pas encore été recensées.
          </p>

          <h2>Contenus non accessibles</h2>
          <p>
            Le site s'appuie sur le Système de design de l'État (DSFR), conçu pour respecter les
            critères d'accessibilité, mais aucun audit complet n'a encore été réalisé. Les contenus
            non conformes seront listés ici à l'issue de cet audit.
          </p>

          <h2>Établissement de cette déclaration</h2>
          <p>
            Cette déclaration a été établie le 1er juillet 2026. Technologie utilisée pour la
            réalisation du site : React, avec le Système de design de l'État (DSFR). Aucun test
            utilisateur ni outil d'évaluation automatisé n'a encore été employé pour vérifier
            l'accessibilité.
          </p>

          <h2>Retour d'information et contact</h2>
          <p>
            Si vous n'arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter
            l'équipe ODICE pour être orienté vers une alternative accessible ou obtenir le contenu
            sous une autre forme.
          </p>

          <h2>Voie de recours</h2>
          <p>
            Si vous avez signalé un défaut d'accessibilité vous empêchant d'accéder à un contenu ou
            à un service et que vous n'avez pas obtenu de réponse satisfaisante, vous pouvez :
          </p>
          <ul>
            <li>
              écrire un message au{" "}
              <a
                className="fr-link"
                href="https://formulaire.defenseurdesdroits.fr/"
                target="_blank"
                rel="noopener external noreferrer"
              >
                Défenseur des droits
              </a>{" "}
              ;
            </li>
            <li>
              contacter{" "}
              <a
                className="fr-link"
                href="https://www.defenseurdesdroits.fr/carte-des-delegues"
                target="_blank"
                rel="noopener external noreferrer"
              >
                le délégué du Défenseur des droits dans votre région
              </a>{" "}
              ;
            </li>
            <li>
              envoyer un courrier par la poste (gratuit, sans timbre) : Défenseur des droits, Libre
              réponse 71120, 75342 Paris CEDEX 07.
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}
