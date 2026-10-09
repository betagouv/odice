// Contenu de l'export PDF d'une simulation (maquette « Votre simulation du … »),
// construit sans React pour être testé indépendamment du rendu PDF.

import {
  Marque,
  type AbattoirsInputs,
  type AbattoirsOutputs,
  type EtablissementsInputs,
  type EtablissementsOutputs,
  type SimulateurVersion,
  type Zone,
} from "@engine";
import {
  AVERTISSEMENT_DEROGATION_DDECPP,
  MARQUE_LABELS,
  zoneLibelleAvecSigle,
} from "@shared/labels/common.labels";
import { STATUT_SIGLES } from "@shared/labels/abattoirs.labels";
import {
  formatDateIsoLocale,
  formatDateIsoToLongFr,
  formatDateLongFr,
} from "@shared/utils/format-date";
import { resultatBadges, type ResultatBadges } from "../components/resultatBadges";

export type LigneSaisie = { libelle: string; valeur: string };
export type SectionSaisie = { titre: string; lignes: LigneSaisie[] };

export type SimulationExport = {
  titre: string;
  saisies: SectionSaisie[];
  dateMiseAJour: string;
  resultats: ResultatBadges;
  derogation: string;
  nomFichier: string;
};

const ouiNon = (valeur: boolean): string => (valeur ? "Oui" : "Non");

type Commun = {
  nomEtablissement: string;
  zoneEtablissement: Zone;
  mcaEtablissement: boolean;
  provenance: LigneSaisie[];
  zoneDestinataire: Zone;
  mcaDestinataire: boolean;
  result: AbattoirsOutputs | EtablissementsOutputs;
  versionCourante: SimulateurVersion;
  date: Date;
};

function construire(c: Commun): SimulationExport {
  return {
    titre: `Votre simulation du ${formatDateLongFr(c.date)}`,
    saisies: [
      {
        titre: `Informations sur votre ${c.nomEtablissement}`,
        lignes: [
          {
            libelle: `Zone de votre ${c.nomEtablissement}`,
            valeur: zoneLibelleAvecSigle(c.zoneEtablissement),
          },
          {
            libelle: "En possession d'un agrément zoosanitaire MCA",
            valeur: ouiNon(c.mcaEtablissement),
          },
        ],
      },
      { titre: "Informations sur l'établissement d'élevage (provenance)", lignes: c.provenance },
      {
        titre: "Informations sur l'établissement destinataire des viandes (destination)",
        lignes: [
          {
            libelle: "Zone de l'établissement destinataire",
            valeur: zoneLibelleAvecSigle(c.zoneDestinataire),
          },
          {
            libelle: "En possession d'un agrément zoosanitaire MCA",
            valeur: ouiNon(c.mcaDestinataire),
          },
        ],
      },
    ],
    dateMiseAJour: formatDateIsoToLongFr(c.versionCourante.dateEffet),
    resultats: resultatBadges(c.result),
    derogation: AVERTISSEMENT_DEROGATION_DDECPP,
    nomFichier: `odice-simulation-${formatDateIsoLocale(c.date)}.pdf`,
  };
}

export function exportAbattoirs(
  inputs: AbattoirsInputs,
  result: AbattoirsOutputs,
  versionCourante: SimulateurVersion,
  date: Date,
): SimulationExport {
  const provenance: LigneSaisie[] = [
    { libelle: "Zone d'origine des porcs", valeur: zoneLibelleAvecSigle(inputs.zoneSuides) },
  ];
  // Statut demandé seulement en ZRII / ZRIII.
  if (inputs.statut !== null) {
    provenance.push({
      libelle: "Statut réglementaire du mouvement des animaux",
      valeur: STATUT_SIGLES[inputs.statut],
    });
  }
  return construire({
    nomEtablissement: "abattoir",
    zoneEtablissement: inputs.zoneAbattoir,
    mcaEtablissement: inputs.mcaAbattoir,
    provenance,
    zoneDestinataire: inputs.zoneEtbDestinataire,
    mcaDestinataire: inputs.mcaEtbDestinataire,
    result,
    versionCourante,
    date,
  });
}

// Les réponses de traitement ne sont pas reprises : elles sont souvent déduites (ADR-0016).
export function exportEtablissements(
  inputs: EtablissementsInputs,
  result: EtablissementsOutputs,
  versionCourante: SimulateurVersion,
  nomEtablissement: string,
  date: Date,
): SimulationExport {
  return construire({
    nomEtablissement,
    zoneEtablissement: inputs.zoneExpediteur,
    mcaEtablissement: inputs.mcaExpediteur,
    provenance: [
      { libelle: "Zone d'origine des porcs", valeur: zoneLibelleAvecSigle(inputs.zoneSuides) },
      {
        libelle: "Marque sanitaire présente sur les viandes à réception",
        valeur: MARQUE_LABELS[inputs.marqueViandes satisfies Marque],
      },
    ],
    zoneDestinataire: inputs.zoneDestinataire,
    mcaDestinataire: inputs.mcaDestinataire,
    result,
    versionCourante,
    date,
  });
}
