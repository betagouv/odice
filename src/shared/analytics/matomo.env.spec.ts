import { describe, expect, it, vi } from "vitest";
import { parseMatomoEnv } from "./matomo.env";

const CORE = {
  VITE_MATOMO_URL: "https://matomo.exemple.fr/",
  VITE_MATOMO_SITE_ID: "42",
};

describe("parseMatomoEnv", () => {
  it("active le tracking quand url + siteId présents et build production", () => {
    const settings = parseMatomoEnv(CORE, true);
    expect(settings.enabled).toBe(true);
    expect(settings.env.url).toBe("https://matomo.exemple.fr/");
    expect(settings.env.siteId).toBe("42");
  });

  it("désactive le tracking hors production même avec les env", () => {
    expect(parseMatomoEnv(CORE, false).enabled).toBe(false);
  });

  it("désactive le tracking si url ou siteId manquant", () => {
    expect(parseMatomoEnv({ VITE_MATOMO_URL: CORE.VITE_MATOMO_URL }, true).enabled).toBe(false);
    expect(parseMatomoEnv({}, true).enabled).toBe(false);
  });

  it("collecte les dimensions personnalisées VITE_MATOMO_DIMENSION_*_ID", () => {
    const settings = parseMatomoEnv(
      { ...CORE, VITE_MATOMO_DIMENSION_PROFIL_ID: "3", VITE_MATOMO_DIMENSION_ZONE_ID: "5" },
      true,
    );
    expect(settings.env.dimensions).toEqual({ profil: 3, zone: 5 });
  });

  it("interprète VITE_DEBUG_MATOMO", () => {
    expect(parseMatomoEnv({ VITE_DEBUG_MATOMO: "true" }, false).debug).toBe(true);
    expect(parseMatomoEnv({}, false).debug).toBe(false);
  });

  it("désactive proprement sur configuration invalide sans lever d'exception", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const settings = parseMatomoEnv(
      { VITE_MATOMO_URL: "pas-une-url", VITE_MATOMO_SITE_ID: "1" },
      true,
    );
    expect(settings.enabled).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
