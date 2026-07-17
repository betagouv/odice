import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const pushMock = vi.fn();

// Force le mode activé pour tester la logique d'envoi.
vi.mock("./matomo.env", () => ({
  matomoSettings: { enabled: true, debug: false, env: { debug: false, dimensions: {} } },
}));
vi.mock("./matomo.client", () => ({ push: (args: unknown[]) => pushMock(args) }));

import { useMatomo } from "./useMatomo";
import { matomoAction, MATOMO_SIMULATEURS, MATOMO_STEPS, MATOMO_EVENT_CATEGORY } from "./events";

const ACTION = matomoAction(MATOMO_SIMULATEURS.ABATTOIRS, MATOMO_STEPS.LANCEE);
const COMBINAISON = matomoAction(MATOMO_SIMULATEURS.ETABLISSEMENTS, MATOMO_STEPS.COMBINAISON);
const DUREE = matomoAction(MATOMO_SIMULATEURS.ABATTOIRS, MATOMO_STEPS.DUREE);

describe("useMatomo (activé)", () => {
  beforeEach(() => pushMock.mockClear());

  it("pose puis supprime les dimensions autour de l'event (set -> track -> delete)", () => {
    const { result } = renderHook(() => useMatomo());
    act(() => {
      result.current.trackEvent(ACTION, undefined, { 3: "abattoir" });
    });

    const calls = pushMock.mock.calls.map((call) => call[0] as unknown[]);
    expect(calls[0]).toEqual(["setCustomDimension", 3, "abattoir"]);
    expect(calls[1]).toEqual(["trackEvent", MATOMO_EVENT_CATEGORY, ACTION]);
    expect(calls[2]).toEqual(["deleteCustomDimension", 3]);
  });

  it("envoie l'action seule quand ni name ni value ne sont fournis", () => {
    const { result } = renderHook(() => useMatomo());
    act(() => {
      result.current.trackEvent(ACTION);
    });

    expect(pushMock.mock.calls[0][0]).toEqual(["trackEvent", MATOMO_EVENT_CATEGORY, ACTION]);
  });

  it("place le name en 4e position", () => {
    const { result } = renderHook(() => useMatomo());
    act(() => {
      result.current.trackEvent(COMBINAISON, { name: "zp>ovale>oui" });
    });

    expect(pushMock.mock.calls[0][0]).toEqual([
      "trackEvent",
      MATOMO_EVENT_CATEGORY,
      COMBINAISON,
      "zp>ovale>oui",
    ]);
  });

  // Régression : le filtre global retirait le name undefined et décalait la value
  // en 4e position (= Matomo l'enregistrait comme nom d'event, jamais comme valeur).
  it("garde la value en 5e position quand le name est absent", () => {
    const { result } = renderHook(() => useMatomo());
    act(() => {
      result.current.trackEvent(DUREE, { value: 42 });
    });

    expect(pushMock.mock.calls[0][0]).toEqual([
      "trackEvent",
      MATOMO_EVENT_CATEGORY,
      DUREE,
      undefined,
      42,
    ]);
  });

  it("envoie name et value ensemble", () => {
    const { result } = renderHook(() => useMatomo());
    act(() => {
      result.current.trackEvent(DUREE, { name: "zp>ovale>oui", value: 0 });
    });

    expect(pushMock.mock.calls[0][0]).toEqual([
      "trackEvent",
      MATOMO_EVENT_CATEGORY,
      DUREE,
      "zp>ovale>oui",
      0,
    ]);
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
