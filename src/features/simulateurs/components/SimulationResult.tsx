// Panneau de résultats commun aux deux simulateurs (sorties de même structure).
// Le parent ne rend ce composant qu'après une soumission valide, donc `result`
// est toujours défini ici.
// Couleur bleue forcée via inline style (DSFR pose `h1..h6 { color: grey }` au
// niveau élément, et Tailwind arbitrary peut être supprimé par le scanner si
// l'agrégation n'est pas littérale ; inline style garantit l'override).

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { AbattoirsOutputs, EtablissementsOutputs, Marque, SimulateurVersion } from "@engine";
import { zoneLibelleLong, type ZoneChoix } from "@shared/labels/common.labels";
import { ROUTES } from "@shared/config/routes.config";
import { formatDateIsoToLongFr } from "@shared/utils/format-date";
import { mentionTraitement } from "./resultatAffichage";
import { resultatBadges, type BadgeSpec } from "./resultatBadges";
import { ExportSimulationButton } from "../export/ExportSimulationButton";
import type { SimulationExport } from "../export/simulationExport";

export type SimulationOutputs = AbattoirsOutputs | EtablissementsOutputs;

// Saisies reprises dans le bandeau des mentions ; statut null si non demandé.
export type SimulationMentions = {
  zoneSuides: ZoneChoix;
  statut: string | null;
};

type Props = {
  result: SimulationOutputs;
  mentions: SimulationMentions;
  // Parcours affiché sous le titre (« Abattoir > autre établissement… »).
  sousTitre: string;
  versionCourante: SimulateurVersion;
  construireExport: (date: Date) => SimulationExport;
  onExport?: () => void;
};

const BLUE = { color: "var(--text-title-blue-france)" } as const;

export function SimulationResult({
  result,
  mentions,
  sousTitre,
  versionCourante,
  construireExport,
  onExport,
}: Props) {
  const badges = resultatBadges(result);
  const details = badges.details;
  const traitement = mentionTraitement(result);
  return (
    <div>
      <Header sousTitre={sousTitre} versionCourante={versionCourante} />

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <ResultBlock title="Possibilité de mouvement">
            <BadgeRow label="France" badge={badges.mouvement.france} />
            <BadgeRow label="UE" badge={badges.mouvement.ue} />
          </ResultBlock>
        </div>
        {details !== null && (
          <>
            <div className="fr-col-12 fr-col-md-6">
              <ResultBlock title="Marque à apposer sur les viandes">
                <MarqueRow marque={details.marque} badge={details.marqueBadge} />
              </ResultBlock>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <ResultBlock title="Traitement d'atténuation selon la destination des viandes">
                <BadgeRow label="France" badge={details.traitement.france} />
                <BadgeRow label="UE" badge={details.traitement.ue} />
              </ResultBlock>
            </div>
            <div className="fr-col-12 fr-col-md-6">
              <ResultBlock title="Document d'accompagnement">
                <BadgeRow label="France" badge={details.document.france} />
                <BadgeRow label="UE" badge={details.document.ue} />
              </ResultBlock>
            </div>
          </>
        )}
      </div>

      {details !== null && (
        <div className="fr-alert fr-alert--info fr-mt-4w">
          <h3 className="fr-alert__title">Mentions à reporter sur les documents commerciaux :</h3>
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

      <ExportSimulationButton construireExport={construireExport} onExport={onExport} />
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

function MarqueRow({ marque, badge }: { marque: Marque | null; badge: BadgeSpec | null }) {
  if (marque === null || badge === null) return null;
  return (
    <div className="flex items-center gap-4">
      <img src={`/images/marques/${marque}.png`} alt="" className="h-14 w-auto" />
      <Badge badge={badge} />
    </div>
  );
}
