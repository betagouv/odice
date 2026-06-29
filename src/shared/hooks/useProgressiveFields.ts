// Affichage progressif des champs d'un formulaire : un seul champ visible au départ,
// chaque saisie révèle le champ applicable suivant. La révélation est monotone
// (une saisie ne masque jamais un autre champ déjà révélé), et survit à la
// réinitialisation des valeurs (revealAll). Logique pure testable hors React.

import { useCallback, useMemo, useState } from "react";

export type ProgressiveFieldConfig<TForm> = {
  key: keyof TForm & string;
  // Champ pris en compte dans la séquence uniquement si applicable (défaut : toujours).
  isApplicable?: (form: TForm) => boolean;
};

function fieldApplicable<TForm>(field: ProgressiveFieldConfig<TForm>, form: TForm): boolean {
  return field.isApplicable ? field.isApplicable(form) : true;
}

// Révèle les champs applicables jusqu'au premier non rempli inclus, en conservant
// les champs déjà révélés. Sentinelle de champ vide : la chaîne "".
export function computeRevealed<TForm>(
  fields: ProgressiveFieldConfig<TForm>[],
  form: TForm,
  previous: ReadonlySet<string>,
): Set<string> {
  const revealed = new Set(previous);
  for (const field of fields) {
    if (!fieldApplicable(field, form)) continue;
    revealed.add(field.key);
    if (form[field.key] === "") break;
  }
  return revealed;
}

export type ProgressiveFields<TForm> = {
  isVisible: (key: keyof TForm & string, form: TForm) => boolean;
  advance: (form: TForm) => void;
  revealAll: () => void;
};

export function useProgressiveFields<TForm>(
  fields: ProgressiveFieldConfig<TForm>[],
  initialForm: TForm,
): ProgressiveFields<TForm> {
  const [revealed, setRevealed] = useState<Set<string>>(() =>
    computeRevealed(fields, initialForm, new Set<string>()),
  );

  const advance = useCallback(
    (form: TForm) => setRevealed((prev) => computeRevealed(fields, form, prev)),
    [fields],
  );

  // Réinitialiser : on garde tous les champs visibles (l'affichage ne disparaît pas).
  const revealAll = useCallback(() => setRevealed(new Set(fields.map((f) => f.key))), [fields]);

  const byKey = useMemo(() => new Map(fields.map((f) => [f.key, f])), [fields]);

  const isVisible = useCallback(
    (key: keyof TForm & string, form: TForm) => {
      if (!revealed.has(key)) return false;
      const field = byKey.get(key);
      return field !== undefined && fieldApplicable(field, form);
    },
    [revealed, byKey],
  );

  return { isVisible, advance, revealAll };
}
