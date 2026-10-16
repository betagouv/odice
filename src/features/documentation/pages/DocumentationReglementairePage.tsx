import { Link } from "react-router-dom";
import { AvertissementNotice } from "@shared/components/AvertissementNotice";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";
import { FICHES } from "../fiches";

const TITRE = "Documentation réglementaire";

export function DocumentationReglementairePage() {
  return (
    <>
      <PageContainer avertissement espaceHaut="reduit">
        <PageTitle>{TITRE}</PageTitle>
        <h1>{TITRE}</h1>
        <hr />

        <p>
          Retrouvez les notions clés et les textes de référence pour comprendre les règles qui
          encadrent les mouvements de viandes et de produits porcins en contexte de peste porcine
          africaine (PPA). Les fiches thématiques vous aident à interpréter les résultats du
          simulateur Odicé et à comprendre les exigences applicables à votre situation.
        </p>

        <ul className="fr-grid-row fr-grid-row--gutters fr-mt-2w list-none! p-0!">
          {FICHES.map((fiche) => (
            <li key={fiche.route} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
              <div className="fr-card fr-enlarge-link">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h2 className="fr-card__title">
                      <Link to={fiche.route}>{fiche.titre}</Link>
                    </h2>
                    <p className="fr-card__desc">{fiche.description}</p>
                  </div>
                </div>
                <div className="fr-card__header">
                  <div className="fr-card__img">
                    <img className="fr-responsive-img" src={fiche.image} alt="" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </PageContainer>

      <AvertissementNotice />
    </>
  );
}
