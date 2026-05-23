// Utilitaires de formatage de dates pour l'UI (FR).

const DATE_LONG_FR = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// « 2026-02-04 » → « 4 février 2026 ».
export function formatDateIsoToLongFr(iso: string): string {
  const date = parseIso(iso);
  return DATE_LONG_FR.format(date);
}

function parseIso(iso: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error(`Date ISO invalide : ${iso}`);
  }
  // Construit en UTC pour éviter les surprises de fuseau horaire.
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Date ISO invalide : ${iso}`);
  }
  return date;
}
