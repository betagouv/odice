import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InfoTooltip } from "./InfoTooltip";

describe("InfoTooltip", () => {
  it("relie le bouton à la bulle via aria-describedby", () => {
    render(<InfoTooltip>Texte d'aide</InfoTooltip>);
    const button = screen.getByRole("button", { name: "Information contextuelle" });
    const tooltip = screen.getByText("Texte d'aide");

    expect(tooltip).toHaveAttribute("role", "tooltip");
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("n'est pas un bouton de soumission", () => {
    render(<InfoTooltip>Texte d'aide</InfoTooltip>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
