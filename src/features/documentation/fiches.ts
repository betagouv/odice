// Fiches thématiques de la documentation réglementaire, dans l'ordre de la maquette.
// Source unique : cartes de l'accueil, titres des fiches et plan du site.

import { ROUTES } from "@shared/config/routes.config";

export type Fiche = {
  titre: string;
  description: string;
  route: string;
  image: string;
};

export const FICHE_ZONES: Fiche = {
  titre: "Zones réglementées",
  description: "Comprendre les différentes zones réglementées et leurs évolutions.",
  route: ROUTES.DOC_ZONES,
  image: "/images/documentation/zones-reglementees.webp",
};

export const FICHE_MARQUES: Fiche = {
  titre: "Marques d'identification ou de salubrité",
  description: "Identifier les trois marques et leurs contextes d'usage.",
  route: ROUTES.DOC_MARQUES,
  image: "/images/documentation/marques.webp",
};

export const FICHE_TRAITEMENT: Fiche = {
  titre: "Traitement d'atténuation",
  description:
    "Consulter les différents critères techniques qui définissent le traitement d'atténuation (viande ou boyaux).",
  route: ROUTES.DOC_TRAITEMENT,
  image: "/images/documentation/traitement-attenuation.webp",
};

export const FICHE_BIOSECURITE: Fiche = {
  titre: "Biosécurité et niveaux de risque",
  description:
    "Comprendre la hiérarchie des risques selon les zones dans lesquelles se trouvent les porcs ou les viandes.",
  route: ROUTES.DOC_BIOSECURITE,
  image: "/images/documentation/biosecurite.webp",
};

export const FICHE_AGREMENT_MCA: Fiche = {
  titre: "Agrément zoosanitaire MCA",
  description: "Comprendre l'agrément et la démarche à réaliser pour l'obtenir.",
  route: ROUTES.DOC_AGREMENT_MCA,
  image: "/images/documentation/agrement-mca.webp",
};

export const FICHE_DOCUMENTS: Fiche = {
  titre: "Documents d'accompagnement",
  description: "Tout savoir sur le laissez-passer sanitaire et le certificat zoosanitaire.",
  route: ROUTES.DOC_DOCUMENTS,
  image: "/images/documentation/documents-accompagnement.webp",
};

export const FICHE_CORPUS: Fiche = {
  titre: "Corpus réglementaire",
  description:
    "Consulter les règlements européens, les arrêtés ministériels et les instructions techniques qui structurent les mouvements des viandes en contexte PPA.",
  route: ROUTES.DOC_CORPUS,
  image: "/images/documentation/corpus-reglementaire.webp",
};

export const FICHE_GLOSSAIRE: Fiche = {
  titre: "Glossaire",
  description: "Mieux comprendre les termes et notions utilisés.",
  route: ROUTES.DOC_GLOSSAIRE,
  image: "/images/documentation/glossaire.webp",
};

export const FICHES: Fiche[] = [
  FICHE_ZONES,
  FICHE_MARQUES,
  FICHE_TRAITEMENT,
  FICHE_BIOSECURITE,
  FICHE_AGREMENT_MCA,
  FICHE_DOCUMENTS,
  FICHE_CORPUS,
  FICHE_GLOSSAIRE,
];
