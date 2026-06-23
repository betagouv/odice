// Panneau de résultats du simulateur Autres Établissements.
// Le parent ne rend ce composant qu'après une soumission valide, donc `result`
// est toujours défini ici. Miroir d'AbattoirsResult (badges DSFR par accent).

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Certification,
  ETABLISSEMENTS_VERSIONS,
  LPS,
  Marque,
  Mouvement,
  Traitement,
  type EtablissementsOutputs,
} from "@engine";
import {
  CERTIFICATION_LABELS,
  LPS_LABELS,
  MARQUE_LABELS,
  MOUVEMENT_LABELS,
} from "@shared/labels/etablissements.labels";
import { ROUTES } from "@shared/config/routes.config";
import { formatDateIsoToLongFr } from "@shared/utils/format-date";

type Props = {
  result: EtablissementsOutputs;
};

const BLUE = { color: "var(--text-title-blue-france)" } as const;

export function EtablissementsResult({ result }: Props) {
  return (
    <div>
      <Header />

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <ResultBlock title="Possibilité de mouvement">
            <BadgeRow label="France" badge={mouvementBadge(result.frMouvement)} />
            <BadgeRow label="UE" badge={mouvementBadge(result.ueMouvement)} />
          </ResultBlock>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <ResultBlock title="Marque à apposer sur les viandes">
            <BadgeRow label="" badge={marqueBadge(result.marque)} />
          </ResultBlock>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <ResultBlock title="Traitement d'atténuation selon la destination des viandes">
            <BadgeRow label="France" badge={traitementBadge(result.frTraitement)} />
            <BadgeRow label="UE" badge={traitementBadge(result.ueTraitement)} />
          </ResultBlock>
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <ResultBlock title="Document d'accompagnement">
            <BadgeRow label="France" badge={lpsBadge(result.frDocument)} />
            <BadgeRow label="UE" badge={certificationBadge(result.ueDocument)} />
          </ResultBlock>
        </div>
      </div>

      <div className="fr-alert fr-alert--info fr-mt-4w">
        <h3 className="fr-alert__title">Ne pas oublier</h3>
        <p>
          En contexte de PPA, des informations de traçabilité complémentaires doivent être
          transmises au destinataire des produits.{" "}
          <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
            Consulter la documentation réglementaire
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function Header() {
  const versionCourante = ETABLISSEMENTS_VERSIONS[0];
  return (
    <div className="fr-grid-row fr-grid-row--middle fr-mb-3w">
      <div className="fr-col">
        <h3 className="fr-h4 fr-mb-0" style={BLUE}>
          Conditions de mouvement des viandes
        </h3>
        <p className="fr-text--sm fr-mb-0" style={BLUE}>
          Établissement du secteur alimentaire &gt; autre établissement destinataire
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
type BadgeVariant = "green-emeraude" | "pink-tuile" | "blue-cumulus" | "beige-gris-galet";

function BadgeRow({ label, badge }: { label: string; badge: BadgeSpec }) {
  return (
    <div className="fr-grid-row fr-grid-row--middle fr-mb-1w">
      {label !== "" && (
        <div className="fr-col-3">
          <span className="fr-text--sm fr-text--bold">{label}</span>
        </div>
      )}
      <div className={label !== "" ? "fr-col-9" : "fr-col-12"}>
        <span className={`fr-badge fr-badge--${badge.variant}`}>{badge.label}</span>
      </div>
    </div>
  );
}

function mouvementBadge(value: Mouvement): BadgeSpec {
  return value === Mouvement.Autorise
    ? { label: MOUVEMENT_LABELS[value].toUpperCase(), variant: "green-emeraude" }
    : { label: MOUVEMENT_LABELS[value].toUpperCase(), variant: "pink-tuile" };
}

function marqueBadge(value: Marque | null): BadgeSpec {
  if (value === null) {
    return { label: "AUCUNE MARQUE", variant: "pink-tuile" };
  }
  return { label: MARQUE_LABELS[value].toUpperCase(), variant: "blue-cumulus" };
}

function traitementBadge(value: Traitement | null): BadgeSpec {
  if (value === null) {
    return { label: "NON APPLICABLE", variant: "beige-gris-galet" };
  }
  return value === Traitement.Obligatoire
    ? { label: "OBLIGATOIRE", variant: "pink-tuile" }
    : { label: "NON OBLIGATOIRE", variant: "green-emeraude" };
}

function lpsBadge(value: LPS | null): BadgeSpec {
  if (value === null) {
    return { label: "NON APPLICABLE", variant: "beige-gris-galet" };
  }
  return { label: LPS_LABELS[value].toUpperCase(), variant: "blue-cumulus" };
}

function certificationBadge(value: Certification | null): BadgeSpec {
  if (value === null) {
    return { label: "NON APPLICABLE", variant: "beige-gris-galet" };
  }
  const map: Record<Certification, BadgeVariant> = {
    [Certification.Obligatoire]: "pink-tuile",
    [Certification.DerogationPossible]: "blue-cumulus",
    [Certification.NonRequise]: "green-emeraude",
  };
  return { label: CERTIFICATION_LABELS[value].toUpperCase(), variant: map[value] };
}
