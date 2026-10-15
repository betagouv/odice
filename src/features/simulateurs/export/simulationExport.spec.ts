import { describe, expect, it } from "vitest";
import {
  ABATTOIRS_VERSIONS,
  ETABLISSEMENTS_VERSIONS,
  Marque,
  Statut,
  Zone,
  evaluateAbattoir,
  evaluateEtablissements,
  type AbattoirsInputs,
  type EtablissementsInputs,
} from "@engine";
import { exportAbattoirs, exportEtablissements } from "./simulationExport";

const DATE = new Date(2026, 9, 6, 10, 0);

const ABATTOIR: AbattoirsInputs = {
  zoneSuides: Zone.ZRII,
  statut: Statut.MrPpa,
  zoneAbattoir: Zone.ZoneIndemne,
  mcaAbattoir: true,
  zoneEtbDestinataire: Zone.ZRI,
  mcaEtbDestinataire: false,
};

describe("exportAbattoirs", () => {
  const modele = exportAbattoirs(ABATTOIR, evaluateAbattoir(ABATTOIR), ABATTOIRS_VERSIONS[0], DATE);

  it("titre et nom de fichier datés du jour de l'export", () => {
    expect(modele.titre).toBe("Votre simulation du 6 octobre 2026");
    expect(modele.nomFichier).toBe("odice-simulation-2026-10-06.pdf");
  });

  it("reprend les trois sections de saisie de la maquette", () => {
    expect(modele.saisies.map((s) => s.titre)).toEqual([
      "Informations sur votre abattoir",
      "Informations sur l'établissement d'élevage (provenance)",
      "Informations sur l'établissement destinataire des viandes (destination)",
    ]);
    expect(modele.saisies[0].lignes).toEqual([
      { libelle: "Zone de votre abattoir", valeur: "Zone indemne" },
      { libelle: "En possession d'un agrément zoosanitaire MCA", valeur: "Oui" },
    ]);
    expect(modele.saisies[1].lignes).toEqual([
      { libelle: "Zone d'origine des porcs", valeur: "Zone réglementée II (ZRII)" },
      { libelle: "Statut réglementaire du mouvement des animaux", valeur: "MR-PPA" },
    ]);
    expect(modele.saisies[2].lignes[1].valeur).toBe("Non");
  });

  it("omet le statut quand il n'a pas été demandé", () => {
    const sansStatut = { ...ABATTOIR, zoneSuides: Zone.ZoneIndemne, statut: null };
    const m = exportAbattoirs(
      sansStatut,
      evaluateAbattoir(sansStatut),
      ABATTOIRS_VERSIONS[0],
      DATE,
    );
    expect(m.saisies[1].lignes).toHaveLength(1);
  });

  it("reprend la date de version et le texte DDecPP", () => {
    expect(modele.dateMiseAJour).toMatch(/\d{4}$/);
    expect(modele.derogation).toContain("DDecPP");
  });
});

describe("exportEtablissements", () => {
  const inputs: EtablissementsInputs = {
    zoneSuides: Zone.ZRII,
    marqueViandes: Marque.OvaleBarree,
    traitementObligatoireFr: false,
    traitementObligatoireUe: true,
    zoneExpediteur: Zone.ZoneIndemne,
    mcaExpediteur: true,
    traitementRealise: true,
    zoneDestinataire: Zone.ZoneIndemne,
    mcaDestinataire: true,
  };
  const modele = exportEtablissements(
    inputs,
    evaluateEtablissements(inputs),
    ETABLISSEMENTS_VERSIONS[0],
    "atelier de découpe",
    DATE,
  );

  it("adapte les libellés au type d'établissement", () => {
    expect(modele.saisies[0].titre).toBe("Informations sur votre atelier de découpe");
    expect(modele.saisies[0].lignes[0].libelle).toBe("Zone de votre atelier de découpe");
  });

  it("reprend la marque reçue mais pas les réponses de traitement", () => {
    expect(modele.saisies[1].lignes).toEqual([
      { libelle: "Zone d'origine des porcs", valeur: "Zone réglementée II (ZRII)" },
      { libelle: "Marque sanitaire présente sur les viandes à réception", valeur: "Ovale barrée" },
    ]);
  });

  it("partage les badges du panneau de résultats", () => {
    expect(modele.resultats.mouvement.france.label).toBe("MOUVEMENT AUTORISÉ");
  });
});
