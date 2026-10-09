import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatutInfoTooltip } from "./StatutInfoTooltip";

describe("StatutInfoTooltip", () => {
  it("met en gras l'intitulé de chaque statut", () => {
    render(<StatutInfoTooltip />);
    expect(screen.getByText(/^MR-PPA — Mouvement respectant/).tagName).toBe("STRONG");
    expect(screen.getByText(/^MNR-PPA — Mouvement ne respectant pas/).tagName).toBe("STRONG");
  });

  it("commence par l'introduction", () => {
    render(<StatutInfoTooltip />);
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveTextContent(
      /^Indique si le mouvement respecte les conditions réglementaires applicables à la PPA\./,
    );
  });
});
