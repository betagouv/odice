import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AVERTISSEMENT_DEROGATION_DDECPP } from "@shared/labels/common.labels";
import { AvertissementNotice } from "./AvertissementNotice";

describe("AvertissementNotice", () => {
  it("rappelle le caractère indicatif de l'outil", () => {
    render(<AvertissementNotice />);
    expect(screen.getByText("à titre indicatif")).toBeInTheDocument();
  });

  it("précise que les dérogations relèvent de la DDecPP", () => {
    render(<AvertissementNotice />);
    // Les deux points clés sont mis en gras (maquette).
    expect(
      screen.getByText(/soumises à l'appréciation de la direction départementale/).tagName,
    ).toBe("STRONG");
    expect(screen.getByText("interdire le mouvement").tagName).toBe("STRONG");
  });

  it("reprend mot pour mot le texte DDecPP partagé avec l'export PDF", () => {
    const { container } = render(<AvertissementNotice />);
    const texte = (container.textContent ?? "").replace(/\s+/g, " ");
    expect(texte).toContain(AVERTISSEMENT_DEROGATION_DDECPP);
  });
});
