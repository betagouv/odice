// Bandeau « Mentions à reporter » rendu avec le vrai moteur, une situation par
// variation de la spec du bandeau bleu (cf. docs/adr/0015-panneau-resultats-commun-et-masquage.md).

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { evaluateAbattoir, Statut, Zone, type AbattoirsInputs } from "@engine";
import { AbattoirsResult } from "./AbattoirsResult";

const BASE: AbattoirsInputs = {
  zoneSuides: Zone.ZoneIndemne,
  statut: null,
  zoneAbattoir: Zone.ZoneIndemne,
  mcaAbattoir: true,
  zoneEtbDestinataire: Zone.ZoneIndemne,
  mcaEtbDestinataire: true,
};

function rendre(inputs: AbattoirsInputs) {
  render(
    <MemoryRouter>
      <AbattoirsResult inputs={inputs} result={evaluateAbattoir(inputs)} />
    </MemoryRouter>,
  );
}

function bandeau(): HTMLElement | null {
  const titre = screen.queryByText(/Mentions à reporter sur les documents commerciaux/);
  return titre === null ? null : (titre.closest(".fr-alert") as HTMLElement | null);
}

function bandeauAffiche(): HTMLElement {
  const element = bandeau();
  expect(element).not.toBeNull();
  return element as HTMLElement;
}

describe("AbattoirsResult — affichage du bandeau", () => {
  it("absent quand le mouvement FR est interdit", () => {
    rendre({ ...BASE, zoneSuides: Zone.ZP, mcaAbattoir: false });
    expect(screen.getAllByText("MOUVEMENT INTERDIT")).toHaveLength(2);
    expect(bandeau()).toBeNull();
  });

  it("présent avec le message de base quand le mouvement FR est autorisé", () => {
    rendre(BASE);
    expect(bandeauAffiche()).toHaveTextContent(
      "Mentions à reporter sur les documents commerciaux :",
    );
  });
});

describe("AbattoirsResult — ligne zone de provenance", () => {
  it("reprend la zone d'origine saisie, en libellé long", () => {
    rendre({ ...BASE, zoneSuides: Zone.ZRII, statut: Statut.MrPpa });
    expect(bandeauAffiche()).toHaveTextContent(
      "Zone de provenance des animaux dont sont issues les viandes : Zone réglementée II",
    );
  });
});

describe("AbattoirsResult — ligne statut", () => {
  it("MR-PPA", () => {
    rendre({ ...BASE, zoneSuides: Zone.ZRII, statut: Statut.MrPpa });
    expect(bandeauAffiche()).toHaveTextContent(
      "Statut du mouvement des animaux dont sont issues les viandes : MR-PPA",
    );
  });

  it("MNR-PPA", () => {
    rendre({ ...BASE, zoneSuides: Zone.ZRII, statut: Statut.MnrPpa });
    expect(bandeauAffiche()).toHaveTextContent(
      "Statut du mouvement des animaux dont sont issues les viandes : MNR-PPA",
    );
  });

  it("aucune ligne quand le statut est vide (zone hors ZRII/ZRIII)", () => {
    rendre(BASE);
    expect(bandeauAffiche()).not.toHaveTextContent("Statut du mouvement");
  });
});

describe("AbattoirsResult — ligne traitement d'atténuation", () => {
  it("FR obligatoire + UE interdit : territoire national", () => {
    // ZRIII MNR-PPA, destinataire non MCA → ovale diagonales parallèles.
    rendre({ ...BASE, zoneSuides: Zone.ZRIII, statut: Statut.MnrPpa, mcaEtbDestinataire: false });
    const element = bandeauAffiche();
    expect(element).toHaveTextContent(
      "Traitement d'atténuation obligatoire pour une mise sur le marché sur le territoire national",
    );
    expect(element).not.toHaveTextContent("échanges intracommunautaires");
  });

  it("FR obligatoire + UE interdit sans traitement : national et intracommunautaire", () => {
    // ZP, MCA partout → ovale barrée.
    rendre({ ...BASE, zoneSuides: Zone.ZP });
    expect(bandeauAffiche()).toHaveTextContent(
      "Traitement d'atténuation obligatoire pour une mise sur le marché sur le territoire national et pour les échanges intracommunautaires",
    );
  });

  it("FR non obligatoire + UE interdit sans traitement : intracommunautaire uniquement", () => {
    // ZRIII MR-PPA, MCA partout → ovale barrée sans traitement FR.
    rendre({ ...BASE, zoneSuides: Zone.ZRIII, statut: Statut.MrPpa });
    expect(bandeauAffiche()).toHaveTextContent(
      "Traitement d'atténuation obligatoire uniquement pour les échanges intracommunautaires",
    );
  });

  it("aucune ligne quand le mouvement UE est autorisé", () => {
    rendre(BASE);
    expect(bandeauAffiche()).not.toHaveTextContent("Traitement d'atténuation");
  });

  it("aucune ligne quand FR non obligatoire + UE interdit (hors ovale barrée)", () => {
    // ZI FS, destinataire non MCA → ovale diagonales parallèles sans traitement FR.
    rendre({ ...BASE, zoneSuides: Zone.ZIFS, mcaEtbDestinataire: false });
    expect(bandeauAffiche()).not.toHaveTextContent("Traitement d'atténuation");
  });
});
