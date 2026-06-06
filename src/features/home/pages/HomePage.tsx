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
            <h2>Aide à la décision pour les professionnels</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis augue ut
              metus hendrerit porttitor. Mauris eu erat felis. Nunc id tellus vel ex dapibus
              venenatis. Aliquam sollicitudin lacus sem, et sollicitudin augue fermentum at. Sed
              volutpat condimentum imperdiet. Praesent aliquet sodales neque, et iaculis augue.
              Donec eros lectus, sodales at porttitor vitae, sagittis ut neque. Maecenas sapien
              ante, fringilla nec aliquet fermentum, sagittis placerat ex. Vestibulum et venenatis
              tellus. Praesent at tristique felis. Nulla varius feugiat magna, id rhoncus justo
              iaculis quis. Aenean aliquam maximus pretium. Aenean diam nulla, elementum quis tempus
              sed, ultricies eget augue. Praesent pharetra magna sit amet risus vehicula, sed
              pretium diam porta.
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
        <section className="fr-grid-row fr-grid-row--gutters fr-grid-row--top fr-mb-2w">
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
            <h2>La Peste Porcine Africaine</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis augue ut
              metus hendrerit porttitor. Mauris eu erat felis. Nunc id tellus vel ex dapibus
              venenatis. Aliquam sollicitudin lacus sem, et sollicitudin augue fermentum at. Sed
              volutpat condimentum imperdiet. Praesent aliquet sodales neque, et iaculis augue.
              Donec eros lectus, sodales at porttitor vitae, sagittis ut neque. Maecenas sapien
              ante, fringilla nec aliquet fermentum, sagittis placerat ex. Vestibulum et venenatis
              tellus. Praesent at tristique felis. Nulla varius feugiat magna, id rhoncus justo
              iaculis quis. Aenean aliquam maximus pretium. Aenean diam nulla, elementum quis tempus
              sed, ultricies eget augue. Praesent pharetra magna sit amet risus vehicula, sed
              pretium diam porta.
            </p>
          </div>
        </section>

        {/* Section 3 — Prévention et biosécurité : texte à gauche, image à droite */}
        <section className="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
          <div className="fr-col-12 fr-col-md-8">
            <h2>Prévention et règles de biosécurité</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis augue ut
              metus hendrerit porttitor. Mauris eu erat felis. Nunc id tellus vel ex dapibus
              venenatis. Aliquam sollicitudin lacus sem, et sollicitudin augue fermentum at. Sed
              volutpat condimentum imperdiet. Praesent aliquet sodales neque, et iaculis augue.
              Donec eros lectus, sodales at porttitor vitae, sagittis ut neque. Maecenas sapien
              ante, fringilla nec aliquet fermentum, sagittis placerat ex. Vestibulum et venenatis
              tellus. Praesent at tristique felis. Nulla varius feugiat magna, id rhoncus justo
              iaculis quis. Aenean aliquam maximus pretium. Aenean diam nulla, elementum quis tempus
              sed, ultricies eget augue. Praesent pharetra magna sit amet risus vehicula, sed
              pretium diam porta.
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
