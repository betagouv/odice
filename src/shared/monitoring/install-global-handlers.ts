// Pose les listeners globaux pour capturer les erreurs non gérées.
// À appeler une seule fois au boot (depuis src/main.tsx).

import { reportError } from "./error-reporter";

let installed = false;

export function installGlobalHandlers(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (event) => {
    reportError(event.error ?? event.message, {
      source: "window.error",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason, {
      source: "unhandledrejection",
    });
  });
}
