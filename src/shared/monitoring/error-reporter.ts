// Reporter d'erreurs centralisé.

export type ErrorContext = Record<string, unknown> & {
  /** Source du report (boundary React, window.error, unhandledrejection...). */
  source: string;
};

export interface ErrorReport {
  timestamp: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  context: ErrorContext;
}

export function reportError(error: unknown, context: ErrorContext): void {
  const err = normalize(error);
  const report: ErrorReport = {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    url: typeof window !== "undefined" ? window.location.href : "n/a",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "n/a",
    context,
  };
  // Phase 1 : console.error structuré (capté nativement par les DevTools).
  console.error("[ODICE error]", report);
}

function normalize(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(typeof value === "string" ? value : JSON.stringify(value));
}
