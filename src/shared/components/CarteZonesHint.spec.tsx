import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MATOMO_ANNEXES } from "@shared/analytics";

const trackEvent = vi.fn();
vi.mock("@shared/analytics", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@shared/analytics")>();
  return {
    ...actual,
    useMatomo: () => ({ trackEvent, trackPageView: vi.fn(), enableHeatmaps: vi.fn() }),
  };
});

import { CarteZonesHint } from "./CarteZonesHint";

describe("CarteZonesHint", () => {
  it("émet l'event de clic vers la carte des zones", () => {
    render(<CarteZonesHint />);
    screen.getByRole("link", { name: "carte" }).click();
    expect(trackEvent).toHaveBeenCalledWith(MATOMO_ANNEXES.CARTE_ZONES);
  });
});
