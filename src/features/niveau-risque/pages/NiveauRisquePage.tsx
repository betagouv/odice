// Page « Niveau de risque des porcs et des viandes », liée depuis le simulateur
// Autres établissements (« référez-vous à ce tableau ») pour les mélanges de viandes.

import type { ReactNode } from "react";
import { ROUTES } from "@shared/config/routes.config";
import { AvertissementNotice } from "@shared/components/AvertissementNotice";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";
import { MARQUE_LABELS, zoneLibelleAvecSigle } from "@shared/labels/common.labels";
import { STATUT_SIGLES } from "@shared/labels/abattoirs.labels";
import { NIVEAUX_ABATTOIRS, NIVEAUX_VIANDES, intensiteNiveau } from "../niveauRisque";

const TITRE = "Niveau de risque des porcs et des viandes";
const VIDE = "-";

export function NiveauRisquePage() {
  return (
    <>
      <PageContainer avertissement>
        <PageTitle>{TITRE}</PageTitle>
        <Breadcrumb segments={[{ label: "Accueil", to: ROUTES.HOME }, { label: TITRE }]} />

        <h1 className="fr-mt-2w">{TITRE}</h1>
        <hr />

        <section className="fr-mb-6w">
          <h2 className="fr-h5">
            Abattoir — Ordonnancement des abattages en fonction du niveau de risque
          </h2>
          <p>
            Afin de <strong>limiter le risque de contamination croisée</strong> entre les différents
            statuts sanitaires des suidés et de{" "}
            <strong>réduire le risque de diffusion de la PPA</strong> au sein de l'établissement,
            les abattages doivent être organisés selon{" "}
            <strong>
              un ordre tenant compte du niveau de risque associé à la zone de provenance des animaux
            </strong>
            .
          </p>
          <p>
            Lorsque plusieurs catégories de suidés présentant des statuts sanitaires différents
            vis-à-vis de la PPA sont abattues au cours d'une même journée,{" "}
            <strong>
              les animaux présentant le statut sanitaire le plus défavorable sont abattus en dernier
            </strong>
            .
          </p>
          <Tableau
            legende="Ordonnancement des abattages par niveau de risque"
            colonnes={[
              "Niveau de risque",
              "Zone de provenance des porcs",
              "Statut du mouvement des porcs",
            ]}
            lignes={NIVEAUX_ABATTOIRS.map((niveau) => [
              zoneLibelleAvecSigle(niveau.zone),
              niveau.statut === null ? VIDE : STATUT_SIGLES[niveau.statut],
            ])}
          />
        </section>

        <hr />

        <section>
          <h2 className="fr-h5">
            Autres industries agroalimentaires — Ordonnancement du niveau de risque des viandes
          </h2>
          <p>
            Lorsque des viandes présentant des statuts sanitaires différents vis-à-vis de la PPA
            sont mélangées dans un même produit fini,{" "}
            <strong>
              ce dernier récupère le statut de la matière première ayant le niveau de risque le plus
              défavorable
            </strong>
            .
          </p>
          <p>
            <span className="fr-icon-warning-fill fr-icon--sm" aria-hidden="true" /> Ce tableau ne
            prend pas en compte les situations où les produits retournent en zone réglementée vers
            un établissement non agréé MCA après avoir subi un traitement d'atténuation.
          </p>
          <Tableau
            legende="Ordonnancement des viandes par niveau de risque"
            colonnes={[
              "Niveau de risque de la matière première",
              "Zone de provenance des porcs",
              "Marque sanitaire de la matière première",
              "Traitement d'atténuation obligatoire (voir document commercial)",
            ]}
            lignes={NIVEAUX_VIANDES.map((niveau) => [
              zoneLibelleAvecSigle(niveau.zone),
              MARQUE_LABELS[niveau.marque].toLowerCase(),
              niveau.traitementObligatoireNational
                ? "traitement d'atténuation obligatoire pour les mouvements nationaux"
                : VIDE,
            ])}
          />
        </section>
      </PageContainer>

      <AvertissementNotice />
    </>
  );
}

// Colonne « niveau » centrée (maquette) ; le ! passe devant l'alignement DSFR.
const CENTRE = "text-center!";
// Les cellules DSFR ont leur propre fond blanc : elles héritent de la couleur de leur ligne.
const FOND_LIGNE = "bg-inherit!";

// Tableau DSFR ; la première colonne (niveau) est numérotée à partir de 1.
function Tableau({
  legende,
  colonnes,
  lignes,
}: {
  legende: string;
  colonnes: string[];
  lignes: ReactNode[][];
}) {
  return (
    <div className="fr-table fr-table--no-caption fr-table--multiline">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption>{legende}</caption>
              <thead>
                <tr>
                  {colonnes.map((colonne, j) => (
                    <th key={colonne} scope="col" className={j === 0 ? CENTRE : undefined}>
                      {colonne}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lignes.map((cellules, i) => (
                  // Style inline : l'intensité varie par ligne, ce qu'aucune classe DSFR ou Tailwind
                  // statique ne couvre. Jetons DSFR, donc l'échelle suit le thème clair / sombre.
                  <tr
                    key={i}
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--background-action-high-error) ${intensiteNiveau(i, lignes.length)}%, var(--background-default-grey))`,
                    }}
                  >
                    <td className={`${FOND_LIGNE} ${CENTRE}`}>{i + 1}</td>
                    {cellules.map((cellule, j) => (
                      <td key={j} className={FOND_LIGNE}>
                        {cellule}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
