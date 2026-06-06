import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportError } from "./error-reporter";

describe("reportError", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("logue un payload structuré pour une Error JS", () => {
    const err = new Error("boom");
    reportError(err, { source: "test" });

    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    const [tag, payload] = consoleErrorSpy.mock.calls[0] as [string, Record<string, unknown>];
    expect(tag).toBe("[ODICE error]");
    expect(payload.message).toBe("boom");
    expect(payload.stack).toBeDefined();
    expect(payload.context).toEqual({ source: "test" });
    expect(payload.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(payload.url).toBeDefined();
    expect(payload.userAgent).toBeDefined();
  });

  it("normalise une string en Error", () => {
    reportError("plain string", { source: "test" });
    const payload = consoleErrorSpy.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(payload.message).toBe("plain string");
  });

  it("normalise un objet quelconque en Error", () => {
    reportError({ code: 42 }, { source: "test" });
    const payload = consoleErrorSpy.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(payload.message).toBe('{"code":42}');
  });
});
