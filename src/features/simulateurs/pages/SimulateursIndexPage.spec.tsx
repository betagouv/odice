import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// jsdom n'implémente pas scrollIntoView (appelé par la page après évaluation).
Element.prototype.scrollIntoView = vi.fn();

const trackEvent = vi.fn();
vi.mock("@shared/analytics", async () => {
  const actual = await vi.importActual<typeof import("@shared/analytics")>("@shared/analytics");
  return {
    ...actual,
    useMatomo: () => ({ trackEvent, trackPageView: vi.fn(), enableHeatmaps: vi.fn() }),
  };
});

import { SimulateursIndexPage } from "./SimulateursIndexPage";
import { MATOMO_EVENTS } from "@shared/analytics";

function selectType(value: string) {
  fireEvent.change(screen.getByLabelText(/Type d'établissement/i), { target: { value } });
}

function getForm(): HTMLElement {
  const form = screen.getByRole("button", { name: /valider/i }).closest("form");
  if (!form) throw new Error("formulaire introuvable");
  return form;
}

// Remplit chaque select avec sa première option valide ; deux passes pour capter
// le select conditionnel "statut" révélé après le choix de la zone.
function fillAndSubmit(form: HTMLElement) {
  for (let pass = 0; pass < 2; pass++) {
    for (const select of within(form).queryAllByRole("combobox")) {
      const option = within(select)
        .getAllByRole("option")
        .find((opt) => !(opt as HTMLOptionElement).disabled);
      if (option)
        fireEvent.change(select, { target: { value: (option as HTMLOptionElement).value } });
    }
  }
  fireEvent.submit(form);
}

describe("SimulateursIndexPage — tracking Matomo", () => {
  beforeEach(() => trackEvent.mockClear());

  it("émet simulateur_ouvert au choix d'un type", () => {
    render(
      <MemoryRouter>
        <SimulateursIndexPage />
      </MemoryRouter>,
    );
    selectType("abattoir");
    expect(trackEvent).toHaveBeenCalledWith(MATOMO_EVENTS.SIMULATEUR_OUVERT, { name: "abattoir" });
  });

  it("émet simulation_lancee puis resultat_affiche à une soumission valide", () => {
    render(
      <MemoryRouter>
        <SimulateursIndexPage />
      </MemoryRouter>,
    );
    selectType("abattoir");
    trackEvent.mockClear();
    fillAndSubmit(getForm());

    const events = trackEvent.mock.calls.map((call) => call[0] as string);
    const lancee = events.indexOf(MATOMO_EVENTS.SIMULATION_LANCEE);
    const affiche = events.indexOf(MATOMO_EVENTS.RESULTAT_AFFICHE);
    expect(lancee).toBeGreaterThanOrEqual(0);
    expect(affiche).toBeGreaterThan(lancee);
  });

  it("émet reinitialisation au clic sur le bouton Réinitialiser", () => {
    render(
      <MemoryRouter>
        <SimulateursIndexPage />
      </MemoryRouter>,
    );
    selectType("abattoir");
    trackEvent.mockClear();
    fireEvent.click(screen.getByRole("button", { name: /réinitialiser/i }));
    expect(trackEvent).toHaveBeenCalledWith(MATOMO_EVENTS.REINITIALISATION, { name: "abattoir" });
  });

  it("n'émet pas reinitialisation sur une simple saisie de champ", () => {
    render(
      <MemoryRouter>
        <SimulateursIndexPage />
      </MemoryRouter>,
    );
    selectType("abattoir");
    trackEvent.mockClear();
    const select = within(getForm()).getAllByRole("combobox")[0];
    const option = within(select)
      .getAllByRole("option")
      .find((opt) => !(opt as HTMLOptionElement).disabled);
    fireEvent.change(select, { target: { value: (option as HTMLOptionElement).value } });
    expect(trackEvent).not.toHaveBeenCalledWith(MATOMO_EVENTS.REINITIALISATION, expect.anything());
  });
});
