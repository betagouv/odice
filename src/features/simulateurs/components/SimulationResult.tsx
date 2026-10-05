// Panneau de résultats commun aux deux simulateurs (sorties de même structure).
// Le parent ne rend ce composant qu'après une soumission valide, donc `result`
// est toujours défini ici.
// Couleur bleue forcée via inline style (DSFR pose `h1..h6 { color: grey }` au
// niveau élément, et Tailwind arbitrary peut être supprimé par le scanner si
// l'agrégation n'est pas littérale ; inline style garantit l'override).

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Certification,
  LPS,
  Marque,
  Mouvement,
  Traitement,
  type AbattoirsOutputs,
  type EtablissementsOutputs,
  type SimulateurVersion,
  type Zone,
} from "@engine";
import {
  CERTIFICATION_LABELS,
  LPS_LABELS,
  MARQUE_LABELS,
  MOUVEMENT_INTERDIT_SANS_TRAITEMENT_LABEL,
  MOUVEMENT_LABELS,
  TRAITEMENT_LABELS,
  zoneLibelleLong,
} from "@shared/labels/common.labels";
import { ROUTES } from "@shared/config/routes.config";
import { formatDateIsoToLongFr } from "@shared/utils/format-date";
import {
  mentionTraitement,
  resultatAffichage,
  ueInterditSansTraitement,
} from "./resultatAffichage";

export type SimulationOutputs = AbattoirsOutputs | EtablissementsOutputs;

// Saisies reprises dans le bandeau des mentions ; statut null si non demandé.
export type SimulationMentions = {
  zoneSuides: Zone;
  statut: string | null;
};

type Props = {
  result: SimulationOutputs;
  mentions: SimulationMentions;
  // Parcours affiché sous le titre (« Abattoir > autre établissement… »).
  sousTitre: string;
  versionCourante: SimulateurVersion;
};

const BLUE = { color: "var(--text-title-blue-france)" } as const;

export function SimulationResult({ result, mentions, sousTitre, versionCourante }: Props) {
  const affichage = resultatAffichage(result);
  const traitement = mentionTraitement(result);
  return (
    <div>
      <Header sousTitre={sousTitre} versionCourante={versionCourante} />

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <ResultBlock title="Possibilité de mouvement">
            <BadgeRow label="France" badge={mouvementBadge(result.frMouvement)} />
            <BadgeRow label="UE" badge={mouvementUeBadge(result)} />
          </ResultBlock>
        </div>
        {affichage.detailsFrance && (
          <>
            <div className="fr-col-12 fr-col-md-6">
              <ResultBlock title="Marque à apposer sur les viandes">
                <MarqueRow marque={result.marque} />
              </ResultBlock>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <ResultBlock title="Traitement d'atténuation selon la destination des viandes">
                <BadgeRow label="France" badge={traitementBadge(result.frTraitement)} />
                {affichage.lignesUe && (
                  <BadgeRow label="UE" badge={traitementBadge(result.ueTraitement)} />
                )}
              </ResultBlock>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <ResultBlock title="Document d'accompagnement">
                <BadgeRow label="France" badge={lpsBadge(result.frDocument)} />
                {affichage.lignesUe && (
                  <BadgeRow label="UE" badge={certificationBadge(result.ueDocument)} />
                )}
              </ResultBlock>
            </div>
          </>
        )}
      </div>

      {affichage.detailsFrance && (
        <div className="fr-alert fr-alert--info fr-mt-4w">
          <h3 className="fr-alert__title">Mentions à reporter sur vos documents commerciaux :</h3>
          <p className="fr-mb-0">
            Zone de provenance des animaux dont sont issues les viandes :{" "}
            <strong>{zoneLibelleLong(mentions.zoneSuides)}</strong>
          </p>
          {mentions.statut !== null && (
            <p className="fr-mb-0">
              Statut du mouvement des animaux dont sont issues les viandes :{" "}
              <strong>{mentions.statut}</strong>
            </p>
          )}
          {traitement !== null && (
            <p className="fr-mb-0">
              Traitement d'atténuation <strong>{traitement}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Header({
  sousTitre,
  versionCourante,
}: {
  sousTitre: string;
  versionCourante: SimulateurVersion;
}) {
  return (
    <div className="fr-grid-row fr-grid-row--middle fr-mb-3w">
      <div className="fr-col">
        <h3 className="fr-h4 fr-mb-0" style={BLUE}>
          Conditions de mouvement des viandes
        </h3>
        <p className="fr-text--sm fr-mb-0" style={BLUE}>
          {sousTitre}
        </p>
      </div>
      <div className="fr-col-auto">
        <p className="fr-text--sm fr-mb-0" style={BLUE}>
          Dernière mise à jour :{" "}
          <Link
            to={`${ROUTES.HISTORIQUE_VERSIONS}#${versionCourante.dateEffet}`}
            target="_blank"
            rel="noopener noreferrer"
            style={BLUE}
          >
            {formatDateIsoToLongFr(versionCourante.dateEffet)}
          </Link>
        </p>
      </div>
    </div>
  );
}

function ResultBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="fr-mb-3w">
      <h4 className="fr-h6 fr-mb-1w" style={BLUE}>
        {title}
      </h4>
      {children}
    </div>
  );
}

type BadgeSpec = { label: string; variant: BadgeVariant };
// Statuts DSFR sans icône (nomenclature maquette : vert, rouge, bleu).
type BadgeVariant = "success" | "error" | "info";

function Badge({ badge }: { badge: BadgeSpec }) {
  return (
    <span className={`fr-badge fr-badge--${badge.variant} fr-badge--no-icon`}>{badge.label}</span>
  );
}

// Valeur null : sortie sans objet, ligne non affichée.
function BadgeRow({ label, badge }: { label: string; badge: BadgeSpec | null }) {
  if (badge === null) return null;
  return (
    <div className="fr-grid-row fr-grid-row--middle fr-mb-1w">
      <div className="fr-col-3">
        <span className="fr-text--sm fr-text--bold">{label}</span>
      </div>
      <div className="fr-col-9">
        <Badge badge={badge} />
      </div>
    </div>
  );
}

function MarqueRow({ marque }: { marque: Marque | null }) {
  if (marque === null) return null;
  return (
    <div className="flex items-center gap-4">
      <img src={`/images/marques/${marque}.png`} alt="" className="h-14 w-auto" />
      <Badge badge={{ label: MARQUE_LABELS[marque].toUpperCase(), variant: "info" }} />
    </div>
  );
}

function mouvementBadge(value: Mouvement): BadgeSpec {
  return value === Mouvement.Autorise
    ? { label: MOUVEMENT_LABELS[value].toUpperCase(), variant: "success" }
    : { label: MOUVEMENT_LABELS[value].toUpperCase(), variant: "error" };
}

function mouvementUeBadge(result: SimulationOutputs): BadgeSpec {
  return ueInterditSansTraitement(result)
    ? { label: MOUVEMENT_INTERDIT_SANS_TRAITEMENT_LABEL.toUpperCase(), variant: "error" }
    : mouvementBadge(result.ueMouvement);
}

function traitementBadge(value: Traitement | null): BadgeSpec | null {
  if (value === null) return null;
  return {
    label: TRAITEMENT_LABELS[value].toUpperCase(),
    variant: value === Traitement.Obligatoire ? "error" : "success",
  };
}

function lpsBadge(value: LPS | null): BadgeSpec | null {
  return value === null ? null : { label: LPS_LABELS[value].toUpperCase(), variant: "info" };
}

function certificationBadge(value: Certification | null): BadgeSpec | null {
  return value === null
    ? null
    : { label: CERTIFICATION_LABELS[value].toUpperCase(), variant: "info" };
}
