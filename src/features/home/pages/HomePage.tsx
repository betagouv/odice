import { Link } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { Notice } from "@shared/components/Notice";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";

export function HomePage() {
  return (
    <>
      <PageTitle>Accueil</PageTitle>
      <PageContainer>
        <h1 className="fr-mt-4w">Bienvenue sur Odicé</h1>
        <hr className="fr-mt-2w fr-mb-4w" />

        {/* Section 1 — Aide à la décision : texte à gauche, image à droite, CTA simulation */}
        <section className="fr-grid-row fr-grid-row--gutters fr-grid-row--top fr-mt-4w fr-mb-2w">
          <div className="fr-col-12 fr-col-md-8">
            <h2>Aide à la décision en santé animale</h2>
            <p>
              Les crises en santé animale mobilisent de nombreux acteurs et nécessitent
              l'application rapide de mesures sanitaires parfois complexes. Dans une approche « One
              health », la prévention et la maîtrise de ces risques reposent sur une compréhension
              partagée des règles qui encadrent les mouvements d'animaux, de produits et de
              sous-produits animaux.
            </p>
            <p>
              Odicé est un simulateur conçu pour faciliter l'accès à ces règles et accompagner les
              acteurs concernés dans leur mise en œuvre. En décrivant leur situation, les
              utilisateurs peuvent identifier les dispositions applicables et être guidés dans les
              décisions à prendre en contexte de crise sanitaire.
            </p>
            <p>
              En favorisant une interprétation homogène de la réglementation, Odicé contribue à
              renforcer la prévention, la gestion et la maîtrise des risques en santé animale.
            </p>
            <Link to={ROUTES.SIMULATEURS} className="fr-btn fr-mt-2w">
              Démarrer une simulation
            </Link>
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <figure className="fr-content-media mt-0!" role="group">
              <div className="fr-content-media__img">
                <img
                  className="fr-responsive-img fr-ratio-1x1"
                  src="/images/image-1.png"
                  alt="Inspection sanitaire de carcasses dans un abattoir"
                />
              </div>
            </figure>
          </div>
        </section>

        {/* Section 2 — La PPA : image à gauche, texte à droite */}
        <section className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-2w">
          <div className="fr-col-12 fr-col-md-4">
            <figure className="fr-content-media mt-0!" role="group">
              <div className="fr-content-media__img">
                <img
                  className="fr-responsive-img fr-ratio-1x1"
                  src="/images/image-2.png"
                  alt="Suidé en élevage derrière une grille"
                />
              </div>
            </figure>
          </div>
          <div className="fr-col-12 fr-col-md-8">
            <h2>La peste porcine africaine</h2>
            <p>
              La peste porcine africaine (PPA) est une maladie virale hautement contagieuse qui
              affecte les porcs et les sangliers. Bien qu'elle ne présente aucun risque pour la
              santé humaine, son introduction sur le territoire aurait des conséquences sanitaires,
              économiques et commerciales majeures pour l'ensemble de la filière porcine.
            </p>
            <p>
              Le virus se caractérise notamment par sa capacité à persister dans les viandes. Le
              transport ou la mise sur le marché de produits contaminés peut ainsi contribuer à sa
              diffusion sur de longues distances et favoriser l'apparition de nouveaux foyers.
            </p>
            <p>
              Pour limiter ce risque, la réglementation prévoit des mesures spécifiques encadrant
              les mouvements et la commercialisation des produits issus des zones concernées par la
              maladie. La bonne compréhension de ces dispositions est essentielle pour concilier
              maîtrise du risque sanitaire et continuité des activités économiques.
            </p>
            <p>
              C'est pourquoi Odicé propose, dans un premier temps, un parcours dédié au devenir des
              produits carnés en contexte de peste porcine africaine, afin d'accompagner les acteurs
              dans l'application des règles sanitaires associées.
            </p>
          </div>
        </section>

        {/* Section 3 — Prévention et biosécurité : texte à gauche, image à droite */}
        <section className="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
          <div className="fr-col-12 fr-col-md-8">
            <h2>Prévention et règles de biosécurité</h2>
            <p>
              La prévention constitue le premier levier de protection contre les maladies animales.
              Face à des maladies comme la peste porcine africaine, l'efficacité des mesures de
              lutte repose en grande partie sur l'application rigoureuse des règles de biosécurité
              par l'ensemble des acteurs concernés.
            </p>
            <p>
              Ces règles visent à réduire les risques d'introduction et de diffusion des agents
              pathogènes à chaque étape de la chaîne alimentaire. Elles reposent notamment sur le
              respect des bonnes pratiques d'hygiène, la maîtrise des mouvements d'animaux, de
              personnes, de véhicules et de produits, ainsi que sur une vigilance constante face aux
              risques sanitaires.
            </p>
            <p>
              La prévention est une responsabilité collective. En contribuant à une meilleure
              compréhension des mesures applicables en situation de crise sanitaire, Odicé participe
              à la diffusion d'une culture commune de la biosécurité et à la protection durable de
              la santé animale.
            </p>
          </div>
          <div className="fr-col-12 fr-col-md-4">
            <figure className="fr-content-media mt-0!" role="group">
              <div className="fr-content-media__img">
                <img
                  className="fr-responsive-img fr-ratio-1x1"
                  src="/images/image-3.png"
                  alt="Sandwich préparé avec de la charcuterie"
                />
              </div>
            </figure>
          </div>
        </section>
      </PageContainer>

      {/* Notice full-width : hors PageContainer pour s'étendre bord à bord du viewport */}
      <Notice title="Avertissement" variant="warning">
        Cet outil est une aide à la décision fournie <strong>à titre indicatif</strong> et ne peut
        en aucun cas se substituer à la consultation des textes réglementaires en vigueur. Malgré
        nos efforts pour assurer l'exactitude des informations, leur exhaustivité et leur mise à
        jour ne peuvent être garanties.{" "}
        <strong>
          Il appartient à l'utilisateur de vérifier la conformité des résultats obtenus avant toute
          prise de décision.
        </strong>{" "}
        En conséquence, nous déclinons toute responsabilité en cas d'erreur, d'omission ou
        d'interprétation incorrecte des informations fournies par cet outil.
      </Notice>
    </>
  );
}
