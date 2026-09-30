import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AvertissementNotice } from "./AvertissementNotice";

describe("AvertissementNotice", () => {
  it("rappelle le caractère indicatif de l'outil", () => {
    render(<AvertissementNotice />);
    expect(screen.getByText("à titre indicatif")).toBeInTheDocument();
  });

  it("précise que les dérogations relèvent de la DDecPP", () => {
    render(<AvertissementNotice />);
    expect(
      screen.getByText(/soumises à l'appréciation de la direction départementale/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/même lorsque celui-ci entre dans le cadre d'une dérogation/),
    ).toBeInTheDocument();
  });
});
