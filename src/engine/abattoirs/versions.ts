// Versions du simulateur Abattoirs, liées aux arrêtés officiels.
// Source de vérité — toute nouvelle version se rajoute en tête de tableau.
// Procédure complète : docs/versions.md

export interface SimulateurVersion {
  /** Date d'effet de l'arrêté, format ISO YYYY-MM-DD. */
  dateEffet: string;
  /** Informations sur l'arrêté officiel. */
  arrete: {
    titre: string;
    reference?: string;
    url?: string;
  };
  /** Chemins (depuis la racine du repo) des fichiers sources versionnés. */
  sources: string[];
  /** Liste des changements par rapport à la version précédente. */
  changements: string[];
  /** URL de la pull request GitHub correspondante. */
  pullRequest?: string;
}

// Ordre antéchronologique : ABATTOIRS_VERSIONS[0] = version courante.
export const ABATTOIRS_VERSIONS: readonly SimulateurVersion[] = [
  {
    dateEffet: "2026-02-04",
    arrete: {
      titre:
        "Arrêté du 4 février 2026 relatif aux mouvements de viandes en contexte de Peste Porcine Africaine",
      reference: "NOR à compléter",
      url: undefined,
    },
    sources: [
      "docs/sources/abattoirs-formules-20260512.docx",
      "docs/sources/abattoirs-test-formules-20260512.xlsx",
      "docs/sources/entrees-sorties-20260520.xlsx",
    ],
    changements: [
      "Version initiale du simulateur Abattoirs.",
      "5 règles métier (marque, mouvement, traitement, LPS, certification) couvrant 2 744 combinaisons.",
    ],
  },
];
