import type { ReactNode } from "react";
import { FicheDocumentation, TitreSection } from "../components/FicheDocumentation";
import { SchemaFauneSauvage, SchemaFoyerElevage } from "../components/SchemasZones";
import { FICHE_ZONES } from "../fiches";

export function ZonesReglementeesPage() {
  return (
    <FicheDocumentation
      fiche={FICHE_ZONES}
      essentiel={
        <>
          Lors de la confirmation d'un cas ou d'un foyer de PPA (Peste Porcine Africaine), des zones
          réglementées sont mises en place. Conformément à la réglementation européenne,{" "}
          <strong>des mesures de restriction s'appliquent dans ces zones</strong>.{" "}
          <strong>Les zones peuvent évoluer en fonction de la situation sanitaire.</strong>
        </>
      }
    >
      <section>
        <TitreSection>Zone indemne</TitreSection>
        <Definition terme="Zone indemne">
          zone dans laquelle aucun foyer ou cas de PPA n'a été détecté.
        </Definition>
      </section>

      <hr />

      <section>
        <TitreSection>Phase mesures d'urgence</TitreSection>
        <Definition terme="Zone infectée faune sauvage réflexe (ZI FS réflexe)">
          zone temporaire (environ 3 jours) d'à peu près 20 km de rayon mise en place lors de la
          détection d'un cas de PPA dans la faune sauvage afin d'évaluer l'étendue de la maladie.
        </Definition>
        <Definition terme="Zone infectée faune sauvage (ZI FS)">
          zone mise en place lors de la détection d'un cas de PPA dans la faune sauvage, ajustée
          selon la surveillance en ZI FS réflexe.
        </Definition>
        <Definition terme="Zone de protection (ZP)">
          zone d'environ 3 km de rayon mise en place lors de la détection d'un foyer de PPA en
          élevage.
        </Definition>
        <Definition terme="Zone de surveillance (ZS)">
          zone d'environ 10 km de rayon mise en place autour de la zone de protection.
        </Definition>
      </section>

      <hr />

      <section>
        <TitreSection>Phase de régionalisation</TitreSection>
        <Definition terme="Zone réglementée I (ZRI)">
          zone indemne de PPA soumise à des mesures de surveillance et de prévention en raison de sa
          proximité avec une zone où la maladie est présente.
        </Definition>
        <Definition terme="Zone réglementée II (ZRII)">
          zone dans laquelle la PPA est uniquement présente dans la faune sauvage.
        </Definition>
        <Definition terme="Zone réglementée III (ZRIII)">
          zone dans laquelle la PPA est présente chez les porcs détenus.
        </Definition>
      </section>

      <hr />

      <section>
        <TitreSection>Évolution des phases et des zones</TitreSection>
        <SchemaFoyerElevage />
        <SchemaFauneSauvage />
      </section>
    </FicheDocumentation>
  );
}

function Definition({ terme, children }: { terme: string; children: ReactNode }) {
  return (
    <p>
      <strong>{terme}</strong> : {children}
    </p>
  );
}
