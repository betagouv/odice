// Versions du simulateur Autres Établissements, liées aux arrêtés officiels.
// Source de vérité — toute nouvelle version se rajoute en tête de tableau.
// Procédure complète : docs/versions.md

import type { SimulateurVersion } from "../shared/types";

// Ordre antéchronologique : ETABLISSEMENTS_VERSIONS[0] = version courante.
export const ETABLISSEMENTS_VERSIONS: readonly SimulateurVersion[] = [
  {
    dateEffet: "2026-06-23",
    arrete: {
      titre:
        "Arrêté du 4 février 2026 relatif aux mouvements de viandes en contexte de Peste Porcine Africaine — volet Autres Établissements",
      reference: "NOR à compléter",
      url: undefined,
    },
    sources: [
      "docs/sources/formules-20260623.docx",
      "docs/sources/etablissements-test-formules-20260623.xlsx",
    ],
    changements: [
      "Version initiale du simulateur Autres Établissements.",
      "5 règles métier (marque, mouvement, traitement, LPS, certification) couvrant 32 928 combinaisons.",
    ],
  },
];
