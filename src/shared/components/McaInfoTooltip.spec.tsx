import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { McaInfoTooltip } from "./McaInfoTooltip";

describe("McaInfoTooltip", () => {
  it("met en gras l'intitulé de l'agrément puis donne sa définition", () => {
    render(<McaInfoTooltip />);
    const titre = screen.getByText(/Agrément zoosanitaire spécifique/);
    expect(titre.tagName).toBe("STRONG");
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveTextContent(
      /restrictions de police sanitaire liées à la PPA\.$/,
    );
  });
});
