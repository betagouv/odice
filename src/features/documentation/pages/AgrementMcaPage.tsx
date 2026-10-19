import type { ReactNode } from "react";
import { FicheDocumentation, TitreSection } from "../components/FicheDocumentation";
import { FICHE_AGREMENT_MCA } from "../fiches";
import { SITE_MINISTERE_AGRICULTURE } from "../liens";

const INSTRUCTION_TECHNIQUE_MCA = "https://info.agriculture.gouv.fr/boagri/instruction-2024-274";

export function AgrementMcaPage() {
  return (
    <FicheDocumentation
      fiche={FICHE_AGREMENT_MCA}
      essentiel={
        <>
          L'agrément zoosanitaire MCA{" "}
          <strong>
            peut être délivré à tout établissement du secteur alimentaire disposant d'un agrément
            sanitaire
          </strong>{" "}
          ainsi qu'<strong>aux entrepôts</strong> capables de garantir une séparation stricte,
          physique ou temporelle, entre les animaux et les produits de niveaux de risque différents.
        </>
      }
    >
      <section>
        <TitreSection>Définition</TitreSection>
        <p>
          L'agrément zoosanitaire MCA (Maladies de Catégorie A) peut être délivré à tout
          établissement du secteur alimentaire disposant d'un agrément sanitaire ainsi qu'aux
          entrepôts souhaitant recevoir des animaux ou des produits soumis à des mesures de
          restriction vis-à-vis de la PPA. Si la France est indemne de peste porcine africaine,
          aucun agrément zoosanitaire MCA n'est valide.
        </p>
        <p>
          Cet agrément vise à garantir l'application de mesures de biosécurité strictes au sein des
          établissements du secteur alimentaire agréés et des entrepôts, telles que :
        </p>
        <ul>
          <li>
            la séparation stricte (spatiale ou temporelle) entre les animaux ou les produits soumis
            à restriction et les autres animaux ou produits ;
          </li>
          <li>
            la mise en place de mesures de biosécurité et de prévention appropriées vis-à-vis des
            personnes, du matériel et des véhicules ;
          </li>
          <li>
            un nettoyage, une désinfection et si nécessaire une désinsectisation et une dératisation
            renforcés et efficaces dans l'ensemble de l'établissement y compris vis-à-vis des moyens
            et équipements de transport des animaux et des produits d'origine animale ;
          </li>
          <li>
            la traçabilité complémentaire des produits soumis à des restrictions de mouvements afin
            d'informer les exploitants tout au long de la chaîne de production de l'origine des
            produits et de leurs conditions de mise sur le marché ;
          </li>
          <li>
            l'apposition d'une marque d'identification spécifique sur les produits et la demande de
            certification zoosanitaire lorsque cela est nécessaire ;
          </li>
          <li>
            le cas échéant, la réalisation d'un traitement d'atténuation conforme aux dispositions
            de l'annexe VII du règlement délégué (UE) 2020/687.
          </li>
        </ul>
      </section>

      <section className="fr-mt-6w">
        <TitreSection>Procédure de demande</TitreSection>
        <Renvoi>
          La procédure de demande d'agrément zoosanitaire MCA est décrite par l'
          <a href={INSTRUCTION_TECHNIQUE_MCA} target="_blank" rel="noopener noreferrer">
            instruction technique DGAL/SDSSA/2024-274 du 14/05/2024
          </a>
          .
        </Renvoi>
        <Renvoi>
          La liste des établissements agréés MCA est disponible sur le{" "}
          <a href={SITE_MINISTERE_AGRICULTURE} target="_blank" rel="noopener noreferrer">
            site internet du ministère chargé de l'agriculture
          </a>
          .
        </Renvoi>
      </section>
    </FicheDocumentation>
  );
}

function Renvoi({ children }: { children: ReactNode }) {
  return (
    <p>
      <span className="fr-icon-arrow-right-line fr-icon--sm fr-mr-1v" aria-hidden="true" />
      {children}
    </p>
  );
}
