import { FicheDocumentation, TitreSection } from "../components/FicheDocumentation";
import { FICHE_TRAITEMENT } from "../fiches";

// Traitements listés à l'annexe VII du règlement délégué (UE) 2020/687.
export function TraitementAttenuationPage() {
  return (
    <FicheDocumentation
      fiche={FICHE_TRAITEMENT}
      essentiel={
        <>
          <strong>Un traitement d'atténuation peut être obligatoire</strong> à la mise sur le marché
          des viandes en fonction de leur statut sanitaire. L'annexe VII du règlement délégué (UE)
          2020/687 définit les traitements d'atténuation pouvant être utilisés pour la PPA.
        </>
      }
    >
      <section>
        <TitreSection>Traitements d'atténuation pour les viandes</TitreSection>
        <ul>
          <li>
            Traitement thermique en récipient hermétique de manière à obtenir une valeur F0 minimale
            de 3.
          </li>
          <li>
            Traitement thermique de manière à obtenir une température à cœur d'au moins 80&nbsp;°C.
          </li>
          <li>
            Traitement thermique de manière à obtenir une température à cœur de 70&nbsp;°C pendant
            au moins 30 minutes.
          </li>
          <li>
            Traitement thermique en récipient hermétique consistant à appliquer une température de
            60&nbsp;°C pendant au moins 4 heures.
          </li>
          <li>
            Pour les viandes désossées, fermentation naturelle et maturation d'une durée minimale de
            9 mois (sauf pour les longes : durée minimale de 140 jours et, pour les jambons :
            période minimale de 190 jours), de manière à obtenir des valeurs maximales d'aw de 0,93
            et de pH de 6.
          </li>
          <li>Séchage après salage pendant une période minimale de 182 jours.</li>
        </ul>
      </section>

      <hr />

      <section>
        <TitreSection>Traitements d'atténuation pour les boyaux</TitreSection>
        <ul>
          <li>
            Salage au chlorure de sodium (NaCl) sous forme sèche ou de saumure saturée (aw &lt;
            0,80), pendant une période ininterrompue de 30 jours ou plus à une température ambiante
            de 20&nbsp;°C ou plus.
          </li>
          <li>
            Salage au sel enrichi en phosphate 86,5&nbsp;% NaCl, 10,7&nbsp;% Na<sub>2</sub>HPO
            <sub>4</sub> et 2,8&nbsp;% Na<sub>3</sub>PO<sub>4</sub> sous forme sèche ou de saumure
            saturée (aw &lt; 0,80), pendant une période ininterrompue de 30 jours ou plus à une
            température ambiante de 20&nbsp;°C ou plus.
          </li>
        </ul>
      </section>
    </FicheDocumentation>
  );
}
