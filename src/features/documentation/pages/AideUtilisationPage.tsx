import { Link } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { AvertissementNotice } from "@shared/components/AvertissementNotice";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

// Guide pas à pas d'utilisation du simulateur, en 2 colonnes (texte / capture).
// Chaque capture est appariée au paragraphe à sa gauche : la carte image épouse
// la hauteur du texte (technique image absolue, cf. HomePage). Captures dans
// public/images/image-aide-1..6.png. Un séparateur (hr) marque chaque étape.
// padding / minHeight ajustables par carte (l'image absolue est bornée par la
// hauteur de la carte : augmenter minHeight agrandit l'image et l'écart au bloc suivant).
// maxWidth (ex. "max-w-52") plafonne l'image et la centre au lieu de remplir la
// carte : utile pour les petites captures (boutons) qui seraient sinon étirées.
type Illustration = {
  src: string;
  alt: string;
  padding?: string;
  minHeight?: string;
  maxWidth?: string;
};

// Carte capture d'écran : bordure, ombre, coins droits, image contenue (jamais rognée),
// hauteur alignée sur la colonne texte appariée.
function IllustrationCard({
  src,
  alt,
  padding = "p-6",
  minHeight = "min-h-48",
  maxWidth,
}: Illustration) {
  return (
    <div className="fr-col-12 fr-col-md-5">
      <div
        className={`relative h-full ${minHeight} border border-[color:var(--border-default-grey)] bg-white shadow-lg md:ml-6`}
      >
        {maxWidth ? (
          <div className={`absolute inset-0 flex items-center justify-center ${padding}`}>
            <img className={`${maxWidth} h-auto w-full object-contain`} src={src} alt={alt} />
          </div>
        ) : (
          <img
            className={`absolute inset-0 h-full w-full object-contain ${padding}`}
            src={src}
            alt={alt}
          />
        )}
      </div>
    </div>
  );
}

export function AideUtilisationPage() {
  return (
    <>
      <PageContainer>
        <PageTitle>Aide à l'utilisation</PageTitle>
        <Breadcrumb
          segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: "Aide à l'utilisation" }]}
        />

        <h1 className="fr-mt-2w">Aide à l'utilisation</h1>
        <hr />

        <h2>Comment utiliser le simulateur Odicé ?</h2>
        <p>
          Le simulateur Odicé vous permet d'identifier les conditions réglementaires applicables à
          un mouvement de produits, en fonction de votre situation.
        </p>
        <Link to={ROUTES.SIMULATEURS} className="fr-btn">
          Démarrer une simulation
        </Link>

        <hr className="fr-my-6w" />

        {/* Étape 1 — un paragraphe, une capture */}
        <section className="fr-grid-row fr-grid-row--gutters items-stretch">
          <div className="fr-col-12 fr-col-md-7">
            <h2>1. Sélectionner votre situation</h2>
            <p>
              Choisissez dans le menu déroulant le type d'établissement à l'origine du mouvement de
              produits.
            </p>
            <p className="fr-mb-0">
              <em>
                Exemple : un exploitant d'abattoir souhaite expédier des produits vers un atelier de
                découpe client et connaître les conditions réglementaires applicables. Il
                sélectionne donc « Abattoir ».
              </em>
            </p>
          </div>
          <IllustrationCard
            src="/images/image-aide-1.png"
            alt="Encart « Votre situation » avec le menu déroulant de sélection du type d'établissement"
            padding="p-6"
            minHeight="min-h-80"
          />
        </section>

        <hr className="fr-my-6w" />

        {/* Étape 2 — deux paragraphes appariés à deux captures */}
        <section className="fr-grid-row fr-grid-row--gutters items-stretch fr-mb-4w">
          <div className="fr-col-12 fr-col-md-7">
            <h2>2. Compléter le formulaire</h2>
            <p className="fr-mb-0">
              Une fois la situation sélectionnée, un formulaire adapté s'affiche. Renseignez chaque
              champ à l'aide des menus déroulants proposés. Les informations demandées permettent au
              simulateur de déterminer les conditions de mouvement correspondant à votre cas.
            </p>
          </div>
          <IllustrationCard
            src="/images/image-aide-2.png"
            alt="Champ « Zone d'origine des suidés » avec son menu déroulant ouvert"
            padding="p-2"
            minHeight="min-h-80"
          />
        </section>
        <section className="fr-grid-row fr-grid-row--gutters items-stretch">
          <div className="fr-col-12 fr-col-md-7">
            <p className="fr-mb-0">
              Pour certains champs, des liens sont mis à disposition afin de vous aider à retrouver
              l'information nécessaire sur les sites de référence.
            </p>
          </div>
          <IllustrationCard
            src="/images/image-aide-3.png"
            alt="Champ « Zone dans laquelle est localisé votre abattoir » avec le lien « Voir carte »"
          />
        </section>

        <hr className="fr-my-6w" />

        {/* Étape 3 — résultat : intro + sous-sections, deux captures appariées.
            image-aide-4 s'étend sur l'intro ET « Possibilité de mouvement ». */}
        <section className="fr-grid-row fr-grid-row--gutters items-stretch fr-mb-4w">
          <div className="fr-col-12 fr-col-md-7">
            <h2>3. Lire le résultat</h2>
            <p>
              Lorsque tous les champs sont complétés, cliquez sur « Valider ». La fiche de résultat
              présente les principales conditions applicables au mouvement envisagé.
            </p>
            <h3>Possibilité de mouvement</h3>
            <p className="fr-mb-0">
              Indique si le mouvement est autorisé ou interdit, et précise l'échelle territoriale
              concernée : territoire national uniquement ou autres États membres de l'Union
              européenne.
            </p>
          </div>
          <IllustrationCard
            src="/images/image-aide-4.png"
            alt="Encart de résultat « Conditions de mouvement des viandes »"
          />
        </section>

        <section className="fr-grid-row fr-grid-row--gutters items-stretch fr-mb-4w">
          <div className="fr-col-12 fr-col-md-7">
            <h3>Marque à apposer sur les viandes</h3>
            <p className="fr-mb-0">
              Précise la marque de salubrité ou d'identification à apposer sur les produits avant
              expédition. Les marques possibles sont : ovale, ovale barrée ou ovale avec diagonales
              parallèles.
            </p>
          </div>
          <IllustrationCard
            src="/images/image-aide-5.png"
            alt="Rappel des marques sanitaires apposables en contexte de crise"
          />
        </section>

        <div className="fr-col-12 fr-col-md-7">
          <h3>Traitement d'atténuation selon la destination des viandes</h3>
          <p>
            Indique si un traitement d'atténuation conforme à la réglementation est obligatoire ou
            non, selon la destination des produits.
          </p>

          <h3>Document d'accompagnement</h3>
          <p className="fr-mb-0">
            Précise les documents qui doivent accompagner le mouvement des produits. Selon la
            situation, un laissez-passer sanitaire peut être nécessaire pour les mouvements sur le
            territoire national, et un certificat zoosanitaire pour les échanges
            intracommunautaires.
          </p>
        </div>

        <hr className="fr-my-6w" />

        {/* Étape 4 — un paragraphe apparié à une capture des boutons */}
        <section className="fr-grid-row fr-grid-row--gutters items-stretch fr-mb-2w">
          <div className="fr-col-12 fr-col-md-7">
            <h2>4. Lancer une nouvelle simulation</h2>
            <p>Pour tester une autre situation, vous pouvez :</p>
            <ul className="fr-mb-0">
              <li>
                modifier directement les champs du formulaire et cliquer sur « Valider » de nouveau
                ;
              </li>
              <li>ou cliquer sur « Réinitialiser » pour remettre tous les champs à zéro.</li>
            </ul>
          </div>
          <IllustrationCard
            src="/images/image-aide-6.png"
            alt="Boutons « Valider » et « Réinitialiser » du formulaire"
            maxWidth="max-w-44"
          />
        </section>
      </PageContainer>

      <AvertissementNotice />
    </>
  );
}
