import type { ReactNode } from "react";
import { Marque } from "@engine";
import { MARQUE_LABELS } from "@shared/labels/common.labels";
import { FicheDocumentation, TitreSection } from "../components/FicheDocumentation";
import { FICHE_MARQUES } from "../fiches";

const DESCRIPTIONS: Record<Marque, ReactNode> = {
  [Marque.Ovale]: (
    <>
      Apposée sur les produits ne faisant pas l'objet de mesures de police sanitaire, cette marque
      indique que la viande peut être mise sur le marché sans restriction et circuler selon les
      conditions générales applicables aux viandes ne faisant pas l'objet de restrictions
      particulières liées à la PPA.
    </>
  ),
  [Marque.OvaleBarree]: (
    <>
      Apposée sur les produits soumis à restriction, cette marque indique que la viande ne peut
      circuler que sur le territoire national et entre des établissements agréés MCA avec un
      laissez-passer sanitaire. Les produits revêtus de cette marque peuvent récupérer une marque
      ovale après avoir fait l'objet d'un traitement d'atténuation prévu à l'annexe VII du règlement
      délégué (UE) 2020/687.
    </>
  ),
  [Marque.OvaleDiagonalesParalleles]: (
    <>
      Apposée sur les produits soumis à restriction, cette marque indique que la viande ne peut être
      mise que sur le marché national. Les produits revêtus de cette marque la conservent malgré la
      réalisation d'un traitement d'atténuation.
    </>
  ),
};

export function MarquesPage() {
  return (
    <FicheDocumentation
      fiche={FICHE_MARQUES}
      essentiel={
        <>
          La marque apposée sur les viandes est déterminée en fonction de leurs conditions
          sanitaires et des restrictions de mouvements applicables. Elle permet notamment de{" "}
          <strong>
            distinguer les viandes soumises à des conditions particulières de mise sur le marché
          </strong>
          .
        </>
      }
    >
      {Object.values(Marque).map((marque) => (
        <section key={marque} className="fr-mb-4w">
          <TitreSection>
            Marque de salubrité ou d'identification {MARQUE_LABELS[marque].toLowerCase()}
          </TitreSection>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
            <img
              src={`/images/marques/${marque}.png`}
              alt={`Marque ${MARQUE_LABELS[marque].toLowerCase()}`}
              className="h-24 w-auto self-start"
            />
            <p className="fr-mb-0">{DESCRIPTIONS[marque]}</p>
          </div>
        </section>
      ))}
    </FicheDocumentation>
  );
}
