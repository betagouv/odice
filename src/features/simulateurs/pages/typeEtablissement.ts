// Types d'établissement proposés dans le sélecteur d'entrée des simulateurs.
// Plusieurs types partagent le même simulateur ("famille") : les établissements
// "autres" (atelier de découpe, entrepôt, transformation, cuisine centrale)
// pointent tous vers le simulateur Autres Établissements.

// La famille pilote le formulaire/résultat affiché et le préfixe Matomo.
export type SimulateurFamille = "abattoir" | "autre";

export type TypeEtablissementOption = {
  value: string;
  label: string;
  // Forme en minuscules pour les libellés du formulaire (« Zone de votre atelier de découpe. »).
  nom: string;
  famille: SimulateurFamille;
};

export const TYPE_ETABLISSEMENT_OPTIONS: TypeEtablissementOption[] = [
  { value: "abattoir", label: "Abattoir", nom: "abattoir", famille: "abattoir" },
  {
    value: "atelier-decoupe",
    label: "Atelier de découpe",
    nom: "atelier de découpe",
    famille: "autre",
  },
  { value: "entrepot", label: "Entrepôt", nom: "entrepôt", famille: "autre" },
  {
    value: "transformation",
    label: "Établissement de transformation",
    nom: "établissement de transformation",
    famille: "autre",
  },
  {
    value: "cuisine-centrale",
    label: "Cuisine centrale",
    nom: "cuisine centrale",
    famille: "autre",
  },
];

// Famille du simulateur pour une valeur sélectionnée, ou null si aucune (placeholder).
export function familleFor(value: string): SimulateurFamille | null {
  return TYPE_ETABLISSEMENT_OPTIONS.find((option) => option.value === value)?.famille ?? null;
}

// Nom de l'établissement sélectionné, ou chaîne vide si aucun (placeholder).
export function nomEtablissementFor(value: string): string {
  return TYPE_ETABLISSEMENT_OPTIONS.find((option) => option.value === value)?.nom ?? "";
}
