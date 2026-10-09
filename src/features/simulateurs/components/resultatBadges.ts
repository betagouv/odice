// Badges du panneau de résultats, partagés par l'affichage web et l'export PDF
// pour garantir les mêmes libellés, couleurs et règles de masquage (cf. ADR-0015).

import { Certification, LPS, Marque, Mouvement, Traitement } from "@engine";
import {
  CERTIFICATION_LABELS,
  LPS_LABELS,
  MARQUE_LABELS,
  MOUVEMENT_INTERDIT_SANS_TRAITEMENT_LABEL,
  MOUVEMENT_LABELS,
  TRAITEMENT_LABELS,
} from "@shared/labels/common.labels";
import type { SimulationOutputs } from "./SimulationResult";
import { resultatAffichage, ueInterditSansTraitement } from "./resultatAffichage";

// Statuts DSFR sans icône (nomenclature maquette : vert, rouge, bleu).
export type BadgeVariant = "success" | "error" | "info";
export type BadgeSpec = { label: string; variant: BadgeVariant };

// Ligne France / UE ; UE absente quand le mouvement UE est interdit.
export type LigneBadges = { france: BadgeSpec | null; ue: BadgeSpec | null };

export type ResultatBadges = {
  mouvement: { france: BadgeSpec; ue: BadgeSpec };
  // Null si le mouvement FR est interdit : rien d'autre à afficher.
  details: {
    marque: Marque | null;
    marqueBadge: BadgeSpec | null;
    traitement: LigneBadges;
    document: LigneBadges;
  } | null;
};

export function resultatBadges(result: SimulationOutputs): ResultatBadges {
  const affichage = resultatAffichage(result);
  const ue = <T>(badge: T): T | null => (affichage.lignesUe ? badge : null);
  return {
    mouvement: { france: mouvementBadge(result.frMouvement), ue: mouvementUeBadge(result) },
    details: affichage.detailsFrance
      ? {
          marque: result.marque,
          marqueBadge: result.marque === null ? null : marqueBadge(result.marque),
          traitement: {
            france: traitementBadge(result.frTraitement),
            ue: ue(traitementBadge(result.ueTraitement)),
          },
          document: {
            france: lpsBadge(result.frDocument),
            ue: ue(certificationBadge(result.ueDocument)),
          },
        }
      : null,
  };
}

function mouvementBadge(value: Mouvement): BadgeSpec {
  return {
    label: MOUVEMENT_LABELS[value].toUpperCase(),
    variant: value === Mouvement.Autorise ? "success" : "error",
  };
}

function mouvementUeBadge(result: SimulationOutputs): BadgeSpec {
  return ueInterditSansTraitement(result)
    ? { label: MOUVEMENT_INTERDIT_SANS_TRAITEMENT_LABEL.toUpperCase(), variant: "error" }
    : mouvementBadge(result.ueMouvement);
}

function marqueBadge(value: Marque): BadgeSpec {
  return { label: MARQUE_LABELS[value].toUpperCase(), variant: "info" };
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
