import { FicheDocumentation, TitreSection } from "../components/FicheDocumentation";
import { FICHE_DOCUMENTS } from "../fiches";
import { SITE_MINISTERE_AGRICULTURE } from "../liens";

export function DocumentsAccompagnementPage() {
  return (
    <FicheDocumentation
      fiche={FICHE_DOCUMENTS}
      essentiel={
        <>
          <p>
            Lorsqu'un mouvement de viandes de porcs est autorisé en contexte de peste porcine
            africaine, <strong>il peut être soumis à des exigences documentaires</strong>.
          </p>
          <p className="fr-mb-0">Selon la situation, le mouvement peut nécessiter :</p>
          <ul className="fr-mb-0">
            <li>un laissez-passer sanitaire (pour les mouvements nationaux) ;</li>
            <li>un certificat zoosanitaire (pour les échanges intracommunautaires).</li>
          </ul>
        </>
      }
    >
      <section>
        <TitreSection>Laissez-passer sanitaire</TitreSection>
        <p>
          Le laissez-passer sanitaire (LPS) est un document de circulation délivré par l'autorité
          compétente du lieu de départ des viandes. Ce document est nécessaire pour les mouvements
          de viandes de porcs devant faire l'objet d'un traitement d'atténuation.
        </p>
        <p className="fr-mb-1w">Il existe deux types de LPS :</p>
        <ul>
          <li>
            le LPS permanent correspond à une autorisation permanente de mouvements de viandes de
            porcs. Le LPS permanent est attribué pour chaque couple « établissement d'origine -
            établissement de destination » disposant tous deux d'un agrément zoosanitaire MCA ;
          </li>
          <li>
            le LPS systématique correspond à une autorisation délivrée pour chaque mouvement de
            viandes de porcs entre un établissement d'origine et un établissement de destination.
          </li>
        </ul>
      </section>

      <hr />

      <section>
        <TitreSection>Le certificat zoosanitaire</TitreSection>
        <p>
          La certification zoosanitaire est obligatoire lors d'échanges intracommunautaires de
          viandes de porcs au départ d'un établissement du secteur alimentaire situé en zone
          réglementée.
        </p>
        <p>La certification zoosanitaire est demandée via TRACES NT.</p>
        <p>
          En fonction des situations, des dérogations à cette obligation sont toutefois possibles.
          La liste des établissements dérogataires à l'obligation de certification zoosanitaire est
          accessible sur le{" "}
          <a href={SITE_MINISTERE_AGRICULTURE} target="_blank" rel="noopener noreferrer">
            site internet du ministère chargé de l'agriculture
          </a>
          .
        </p>
        <p>
          Si la France est indemne de peste porcine africaine, aucune dérogation à l'obligation de
          certification zoosanitaire n'est délivrée.
        </p>
      </section>
    </FicheDocumentation>
  );
}
