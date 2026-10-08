// Alerte rouge d'une situation de saisie impossible : la validation reste bloquée.
export function SituationImpossibleAlert({ message }: { message: string }) {
  return (
    <div className="fr-alert fr-alert--error fr-alert--sm fr-mb-3w" role="alert">
      <p>{message}</p>
    </div>
  );
}
