import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const pushMock = vi.fn();

// Force le mode activé pour tester la logique d'envoi.
vi.mock("./matomo.env", () => ({
  matomoSettings: { enabled: true, debug: false, env: { debug: false, dimensions: {} } },
}));
vi.mock("./matomo.client", () => ({ push: (args: unknown[]) => pushMock(args) }));

import { useMatomo } from "./useMatomo";
import { MATOMO_EVENTS, MATOMO_EVENT_CATEGORY } from "./events";

describe("useMatomo (activé)", () => {
  beforeEach(() => pushMock.mockClear());

  it("pose puis supprime les dimensions autour de l'event (set -> track -> delete)", () => {
    const { result } = renderHook(() => useMatomo());
    act(() => {
      result.current.trackEvent(MATOMO_EVENTS.SIMULATION_LANCEE, undefined, { 3: "abattoir" });
    });

    const calls = pushMock.mock.calls.map((call) => call[0] as unknown[]);
    expect(calls[0]).toEqual(["setCustomDimension", 3, "abattoir"]);
    expect(calls[1]).toEqual([
      "trackEvent",
      MATOMO_EVENT_CATEGORY,
      MATOMO_EVENTS.SIMULATION_LANCEE,
    ]);
    expect(calls[2]).toEqual(["deleteCustomDimension", 3]);
  });

  it("pose setCustomUrl avant trackPageView", () => {
    const { result } = renderHook(() => useMatomo());
    act(() => {
      result.current.trackPageView("https://odice.fr/simulateurs");
    });

    const calls = pushMock.mock.calls.map((call) => call[0] as unknown[]);
    expect(calls[0]).toEqual(["setCustomUrl", "https://odice.fr/simulateurs"]);
    expect(calls[1]).toEqual(["trackPageView"]);
  });
});
