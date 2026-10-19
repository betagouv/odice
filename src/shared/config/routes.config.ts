const DOC = "/documentation-reglementaire";

export const ROUTES = {
  HOME: "/",
  SIMULATEURS: "/simulateurs",
  DOCUMENTATION_REGLEMENTAIRE: DOC,
  DOC_ZONES: `${DOC}/zones-reglementees`,
  DOC_MARQUES: `${DOC}/marques-identification-salubrite`,
  DOC_TRAITEMENT: `${DOC}/traitement-attenuation`,
  DOC_BIOSECURITE: `${DOC}/biosecurite-niveaux-de-risque`,
  DOC_AGREMENT_MCA: `${DOC}/agrement-zoosanitaire-mca`,
  DOC_DOCUMENTS: `${DOC}/documents-accompagnement`,
  DOC_CORPUS: `${DOC}/corpus-reglementaire`,
  DOC_GLOSSAIRE: `${DOC}/glossaire`,
  HISTORIQUE_VERSIONS: "/historique-versions",
  // Ancienne URL de la fiche Biosécurité, redirigée pour les favoris et liens externes.
  NIVEAU_RISQUE: "/niveau-de-risque",
  PLAN_DU_SITE: "/plan-du-site",
  ACCESSIBILITE: "/accessibilite",
  MENTIONS_LEGALES: "/mentions-legales",
  DONNEES_PERSONNELLES: "/donnees-personnelles",
  GESTION_COOKIES: "/gestion-des-cookies",
} as const;
