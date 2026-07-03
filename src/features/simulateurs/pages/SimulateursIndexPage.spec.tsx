import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

// L'évaluation et les panneaux de résultat sont hors périmètre : on isole la page
// pour ne tester QUE l'émission des events, sans dépendre des internes du formulaire.
vi.mock("@engine", async () => {
  const actual = await vi.importActual<typeof import("@engine")>("@engine");
  return { ...actual, evaluateAbattoir: () => ({}), evaluateEtablissements: () => ({}) };
});
vi.mock("../abattoirs/components/AbattoirsResult", () => ({ AbattoirsResult: () => null }));
vi.mock("../etablissements/components/EtablissementsResult", () => ({
  EtablissementsResult: () => null,
}));

// Inputs réalistes soumis par les mocks, pour asserter la signature de combinaison.
// vi.hoisted : la valeur doit exister quand les factories vi.mock (hoistées) s'exécutent.
const { ABATTOIRS_INPUTS } = vi.hoisted(() => ({
  ABATTOIRS_INPUTS: {
    zoneSuides: "zrii",
    statut: "mr-ppa",
    zoneAbattoir: "zs",
    mcaAbattoir: true,
    zoneEtbDestinataire: "zri",
    mcaEtbDestinataire: false,
  },
}));

// Formulaires mockés : de simples boutons qui déclenchent les callbacks de la page.
type FormMock = { onSubmit: (inputs: unknown) => void; onReset: () => void; onChange?: () => void };
function formMock(prefix: string, inputs: unknown) {
  return function MockForm({ onSubmit, onReset, onChange }: FormMock) {
    return (
      <div>
        <button type="button" onClick={() => onSubmit(inputs)}>
          {prefix}-submit
        </button>
        <button type="button" onClick={() => onReset()}>
          {prefix}-reset
        </button>
        <button type="button" onClick={() => onChange?.()}>
          {prefix}-change
        </button>
      </div>
    );
  };
}
vi.mock("../abattoirs/components/AbattoirsForm", () => ({
  AbattoirsForm: formMock("abattoir", ABATTOIRS_INPUTS),
}));
vi.mock("../etablissements/components/EtablissementsForm", () => ({
  EtablissementsForm: formMock("etab", {}),
}));

import { SimulateursIndexPage } from "./SimulateursIndexPage";
import {
  matomoAction,
  MATOMO_SIMULATEURS,
  MATOMO_STEPS,
  serialiseCombinaisonAbattoirs,
} from "@shared/analytics";
import type { AbattoirsInputs } from "@engine";

const A = MATOMO_SIMULATEURS.ABATTOIRS;

function renderPage() {
  render(
    <MemoryRouter>
      <SimulateursIndexPage />
    </MemoryRouter>,
  );
}

function selectAbattoir() {
  fireEvent.change(screen.getByLabelText(/Type d'établissement/i), {
    target: { value: "abattoir" },
  });
}

describe("SimulateursIndexPage — tracking Matomo", () => {
  beforeEach(() => trackEvent.mockClear());

  it("émet simulateur_ouvert au choix d'un type", () => {
    renderPage();
    selectAbattoir();
    expect(trackEvent).toHaveBeenCalledWith(matomoAction(A, MATOMO_STEPS.OUVERT));
  });

  it("émet simulation_lancee puis resultat_affiche à une soumission valide", () => {
    renderPage();
    selectAbattoir();
    trackEvent.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "abattoir-submit" }));

    const events = trackEvent.mock.calls.map((call) => call[0] as string);
    const lancee = events.indexOf(matomoAction(A, MATOMO_STEPS.LANCEE));
    const affiche = events.indexOf(matomoAction(A, MATOMO_STEPS.RESULTAT));
    expect(lancee).toBeGreaterThanOrEqual(0);
    expect(affiche).toBeGreaterThan(lancee);
  });

  it("émet la combinaison (Event Name = signature) à une soumission valide", () => {
    renderPage();
    selectAbattoir();
    trackEvent.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "abattoir-submit" }));

    expect(trackEvent).toHaveBeenCalledWith(matomoAction(A, MATOMO_STEPS.COMBINAISON), {
      name: serialiseCombinaisonAbattoirs(ABATTOIRS_INPUTS as AbattoirsInputs),
    });
  });

  it("émet reinitialisation au clic sur le bouton Réinitialiser", () => {
    renderPage();
    selectAbattoir();
    trackEvent.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "abattoir-reset" }));
    expect(trackEvent).toHaveBeenCalledWith(matomoAction(A, MATOMO_STEPS.REINITIALISATION));
  });

  it("n'émet pas reinitialisation sur une simple saisie de champ", () => {
    renderPage();
    selectAbattoir();
    trackEvent.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "abattoir-change" }));
    expect(trackEvent).not.toHaveBeenCalledWith(matomoAction(A, MATOMO_STEPS.REINITIALISATION));
  });
});
