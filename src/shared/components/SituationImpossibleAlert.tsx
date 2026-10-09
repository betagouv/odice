// Alerte rouge d'une situation de saisie impossible : la validation reste bloquée.
const PREFIXE = "Situation impossible";

export function SituationImpossibleAlert({ message }: { message: string }) {
  const reste = message.startsWith(PREFIXE) ? message.slice(PREFIXE.length) : null;
  return (
    <div className="fr-alert fr-alert--error fr-alert--sm fr-mb-3w" role="alert">
      <p>
        {reste === null ? (
          message
        ) : (
          <>
            <strong>{PREFIXE}</strong>
            {reste}
          </>
        )}
      </p>
    </div>
  );
}
