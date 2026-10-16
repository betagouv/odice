import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FICHE_GLOSSAIRE, FICHE_ZONES, ancreTerme } from "@features/documentation/fiches";
import { LienFicheDoc } from "./LienFicheDoc";

describe("LienFicheDoc", () => {
  it("ouvre la fiche dans un nouvel onglet, avec un intitulé explicite", () => {
    render(<LienFicheDoc fiche={FICHE_ZONES} />, { wrapper: MemoryRouter });
    const lien = screen.getByRole("link", {
      name: "Consulter la fiche « Zones réglementées » - nouvelle fenêtre",
    });
    expect(lien).toHaveAttribute("href", "/documentation-reglementaire/zones-reglementees");
    expect(lien).toHaveAttribute("target", "_blank");
  });

  it("pointe vers un terme du glossaire", () => {
    render(<LienFicheDoc fiche={FICHE_GLOSSAIRE} ancre={ancreTerme("MNR-PPA")} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/documentation-reglementaire/glossaire#mnr-ppa",
    );
  });
});

describe("ancreTerme", () => {
  it("retire accents, parenthèses et espaces", () => {
    expect(ancreTerme("Zone réglementée II (ZRII)")).toBe("zone-reglementee-ii-zrii");
    expect(ancreTerme("MNR-PPA")).toBe("mnr-ppa");
  });
});
