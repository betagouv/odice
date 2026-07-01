import { Link } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

// TODO: confirmer avant mise en ligne le responsable de traitement, le DPO, la durée de
// conservation exacte de la mesure d'audience et la configuration Matomo (exemption CNIL).
export function DonneesPersonnellesPage() {
  return (
    <PageContainer>
      <PageTitle>Données personnelles</PageTitle>
      <Breadcrumb
        segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Données personnelles" }]}
      />

      <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
        <div className="fr-col-12 fr-col-md-8">
          <h1>Politique de protection des données</h1>
          <p className="fr-text--lead">Dernière mise à jour : 1er juillet 2026.</p>
          <p>
            ODICE est un service public qui aide les professionnels à déterminer les règles
            applicables aux mouvements de viandes en contexte de peste porcine africaine (PPA).
            Cette politique décrit, de façon simple, quelles données sont traitées et pourquoi.
          </p>

          <h2>1. Responsable de traitement</h2>
          <p>
            Le responsable de traitement est la Direction générale de l'alimentation (DGAL) du
            ministère de l'Agriculture et de la Souveraineté alimentaire, 251 rue de Vaugirard,
            75732 Paris Cedex 15. Le ministère a désigné un délégué à la protection des données
            (DPO), point de contact privilégié de la Commission nationale de l'informatique et des
            libertés (CNIL).
          </p>

          <h2>2. Quelles données sont collectées ?</h2>
          <p>
            ODICE fonctionne sans création de compte ni authentification. Les informations que vous
            saisissez dans le simulateur (zone d'origine, statut sanitaire, marque de salubrité,
            etc.) sont traitées <strong>directement dans votre navigateur</strong> pour produire le
            résultat réglementaire : elles ne sont ni transmises à un serveur, ni enregistrées. Ce
            ne sont pas des données à caractère personnel.
          </p>
          <p>Sont uniquement traitées à des fins de mesure d'audience :</p>
          <ul>
            <li>
              des données techniques liées à la navigation (pages consultées, type de navigateur,
              système, provenance) ;
            </li>
            <li>
              un identifiant de visite déposé par l'outil de mesure d'audience, ne contenant aucune
              donnée nominative.
            </li>
          </ul>

          <h2>3. Pourquoi ces données sont-elles traitées ?</h2>
          <ul>
            <li>fournir le résultat réglementaire demandé par le simulateur ;</li>
            <li>
              mesurer l'usage du service et l'améliorer (statistiques anonymes de fréquentation et
              de parcours).
            </li>
          </ul>

          <h2>4. Sur quelle base légale ?</h2>
          <p>
            Les traitements reposent sur l'exécution d'une mission d'intérêt public dont est
            investie la DGAL. La mesure d'audience est réalisée à des fins strictement internes
            d'amélioration du service.
          </p>

          <h2>5. Combien de temps sont-elles conservées ?</h2>
          <p>
            Les informations saisies dans le simulateur ne sont pas conservées. Les données de
            mesure d'audience sont conservées à des fins statistiques pendant une durée maximale de
            25 mois, conformément aux recommandations de la CNIL.
          </p>

          <h2>6. Qui a accès aux données ?</h2>
          <p>
            Seules les personnes habilitées de l'équipe ODICE et de la DGAL accèdent aux
            statistiques d'usage, pour les finalités décrites ci-dessus. La mesure d'audience est
            assurée par la plateforme de statistiques de beta.gouv (Matomo). L'hébergement est
            assuré par Scalingo (France, Union européenne). Aucune donnée n'est cédée à des tiers à
            des fins commerciales ni transférée hors de l'Union européenne.
          </p>

          <h2>7. Cookies et traceurs</h2>
          <p>
            ODICE n'utilise aucun cookie publicitaire ni traceur tiers. La mesure d'audience Matomo
            est configurée en mode sans cookie : aucune information n'est stockée sur votre appareil
            à des fins de suivi, et les données recueillies sont anonymisées. Cette configuration
            permet une mesure d'audience exemptée de consentement au sens de la CNIL. Voir la page{" "}
            <Link className="fr-link" to={ROUTES.GESTION_COOKIES}>
              Gestion des cookies
            </Link>
            .
          </p>

          <h2>8. Vos droits</h2>
          <p>
            Conformément au RGPD et à la loi « Informatique et libertés », vous disposez d'un droit
            d'accès, de rectification, d'effacement, de limitation et d'opposition sur vos données.
            Pour les exercer, contactez le délégué à la protection des données du ministère de
            l'Agriculture et de la Souveraineté alimentaire. Si vous estimez, après nous avoir
            contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à
            la CNIL.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
