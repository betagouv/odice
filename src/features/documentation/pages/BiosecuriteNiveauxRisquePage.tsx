// Fiche liée depuis le simulateur Autres établissements (« référez-vous à ce tableau »)
// pour les mélanges de viandes.

import type { ReactNode } from "react";
import { MARQUE_LABELS, zoneLibelleAvecSigle } from "@shared/labels/common.labels";
import { STATUT_SIGLES } from "@shared/labels/abattoirs.labels";
import { FicheDocumentation, TitreSection } from "../components/FicheDocumentation";
import { FICHE_BIOSECURITE } from "../fiches";
import {
  COULEUR_ECHELLE,
  NIVEAUX_ABATTOIRS,
  NIVEAUX_VIANDES,
  intensiteNiveau,
} from "../niveauRisque";

const VIDE = "-";

export function BiosecuriteNiveauxRisquePage() {
  return (
    <FicheDocumentation
      fiche={FICHE_BIOSECURITE}
      essentiel={
        <>
          Les établissements du secteur alimentaire recevant des animaux ou des produits soumis à
          restriction doivent respecter un certain niveau de biosécurité pour{" "}
          <strong>prévenir tout risque de diffusion de la maladie</strong>. Parmi ces mesures, on
          retrouve notamment <strong>la séparation des flux</strong>. Pour garantir l'absence de
          contamination entre les animaux et les produits de statut sanitaire différents, il
          convient de <strong>respecter la hiérarchisation des niveaux de risque</strong> des porcs
          et des viandes.
        </>
      }
    >
      <section className="fr-mb-6w">
        <TitreSection>Niveau de risque des porcs dans les abattoirs</TitreSection>
        <p>
          Afin de <strong>limiter le risque de contamination croisée</strong> entre les différents
          statuts sanitaires des suidés et de{" "}
          <strong>réduire le risque de diffusion de la PPA</strong> au sein de l'établissement, les
          abattages doivent être organisés selon{" "}
          <strong>
            un ordre tenant compte du niveau de risque associé à la zone de provenance des animaux
          </strong>
          .
        </p>
        <p>
          Lorsque plusieurs catégories de suidés présentant des statuts sanitaires différents
          vis-à-vis de la PPA sont abattues au cours d'une même journée,{" "}
          <strong>
            les animaux présentant le niveau de risque le plus élevé sont abattus en dernier
          </strong>
          .
        </p>
        <Tableau
          legende="Niveau de risque des porcs dans les abattoirs"
          colonnes={[
            "Niveau de risque des porcs",
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
        <TitreSection>
          Niveau de risque des viandes dans les établissements du secteur alimentaire
        </TitreSection>
        <p>
          Lorsque des viandes présentant des statuts sanitaires différents vis-à-vis de la PPA sont
          mélangées dans un même produit fini,{" "}
          <strong>
            ce dernier récupère le statut de la matière première ayant le niveau de risque le plus
            élevé
          </strong>
          .
        </p>
        <p>
          <span className="fr-icon-warning-fill fr-icon--sm" aria-hidden="true" /> Ce tableau ne
          prend pas en compte les situations où les produits retournent en zone réglementée vers un
          établissement non agréé MCA après avoir subi un traitement d'atténuation.
        </p>
        <Tableau
          legende="Niveau de risque des viandes dans les établissements du secteur alimentaire"
          colonnes={[
            "Niveau de risque de la matière première",
            "Zone de provenance des porcs",
            "Marque sanitaire de la matière première",
            <>
              Traitement d'atténuation obligatoire
              <br />
              (voir document commercial)
            </>,
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
    </FicheDocumentation>
  );
}

// Colonne « niveau » centrée (maquette) ; le ! passe devant l'alignement DSFR.
const CENTRE = "text-center!";
// Les cellules DSFR ont leur propre fond blanc : elles héritent de la couleur de leur ligne.
// Texte noir imposé (le DSFR le met en gris) ; la zone reste sur une seule ligne.
const FOND_LIGNE = "bg-inherit! text-black!";
const SANS_RETOUR = "whitespace-nowrap!";

// Tableau DSFR ; la première colonne (niveau) est numérotée à partir de 1.
function Tableau({
  legende,
  colonnes,
  lignes,
}: {
  legende: string;
  colonnes: ReactNode[];
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
                    <th key={j} scope="col" className={j === 0 ? CENTRE : undefined}>
                      {colonne}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lignes.map((cellules, i) => (
                  // Style inline : l'intensité varie par ligne, ce qu'aucune classe DSFR ou Tailwind
                  // statique ne couvre. Hex fixe de la maquette, sur blanc : texte noir lisible.
                  <tr
                    key={i}
                    style={{
                      backgroundColor: `color-mix(in srgb, ${COULEUR_ECHELLE} ${intensiteNiveau(i, lignes.length)}%, #fff)`,
                    }}
                  >
                    <td className={`${FOND_LIGNE} ${CENTRE}`}>{i + 1}</td>
                    {cellules.map((cellule, j) => (
                      <td key={j} className={j === 0 ? `${FOND_LIGNE} ${SANS_RETOUR}` : FOND_LIGNE}>
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
