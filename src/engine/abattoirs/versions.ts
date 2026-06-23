// Versions du simulateur Abattoirs, liées aux arrêtés officiels.
// Source de vérité — toute nouvelle version se rajoute en tête de tableau.
// Procédure complète : docs/versions.md

import type { SimulateurVersion } from "../shared/types";

// Ordre antéchronologique : ABATTOIRS_VERSIONS[0] = version courante.
export const ABATTOIRS_VERSIONS: readonly SimulateurVersion[] = [
  {
    dateEffet: "2026-06-05",
    arrete: {
      titre:
        "Correctif du 5 juin 2026 — arrêté du 4 février 2026 relatif aux mouvements de viandes en contexte de Peste Porcine Africaine",
      reference: "NOR à compléter",
      url: undefined,
    },
    sources: [
      "docs/sources/abattoirs-formules-20260512.docx",
      "docs/sources/abattoirs-test-formules-20260605.xlsx",
      "docs/sources/entrees-sorties-20260520.xlsx",
    ],
    changements: [
      "Les 195 cas de mouvement UE autorisé sans certification renseignée affichent désormais « Dérogation à la certification zoosanitaire possible » (TODO 2 et TODO 3 résolus).",
      "Les 35 cas de mouvement FR autorisé sans LPS renseigné affichent désormais « LPS non requis » (TODO 1 résolu).",
      "336 cas de mouvement FR interdit vers une zone saine (zone indemne ou ZRI) affichent désormais « LPS non requis » au lieu de rester vides.",
      "Libellé « Dérogation à la certification zoosanitaire obligatoire » renommé en « possible » (TODO 4 résolu).",
    ],
  },
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
