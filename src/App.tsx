import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { ErrorBoundary } from "@shared/components/ErrorBoundary";
import { Layout } from "@shared/components/layout/Layout";
import { ScrollToTop } from "@shared/components/layout/ScrollToTop";
import { Matomo } from "@shared/analytics";
import { HomePage } from "@features/home/pages/HomePage";
import { SimulateursIndexPage } from "@features/simulateurs/pages/SimulateursIndexPage";
import { DocumentationReglementairePage } from "@features/documentation/pages/DocumentationReglementairePage";
import { ZonesReglementeesPage } from "@features/documentation/pages/ZonesReglementeesPage";
import { MarquesPage } from "@features/documentation/pages/MarquesPage";
import { TraitementAttenuationPage } from "@features/documentation/pages/TraitementAttenuationPage";
import { BiosecuriteNiveauxRisquePage } from "@features/documentation/pages/BiosecuriteNiveauxRisquePage";
import { AgrementMcaPage } from "@features/documentation/pages/AgrementMcaPage";
import { GlossairePage } from "@features/documentation/pages/GlossairePage";
import { DocumentsAccompagnementPage } from "@features/documentation/pages/DocumentsAccompagnementPage";
import { CorpusReglementairePage } from "@features/documentation/pages/CorpusReglementairePage";
import { HistoriqueVersionsPage } from "@features/historique/pages/HistoriqueVersionsPage";
import { ErrorFallbackPage } from "@features/error/pages/ErrorFallbackPage";
import { NotFoundPage } from "@features/error/pages/NotFoundPage";
import { PlanDuSitePage } from "@features/legal/pages/PlanDuSitePage";
import { AccessibilitePage } from "@features/legal/pages/AccessibilitePage";
import { MentionsLegalesPage } from "@features/legal/pages/MentionsLegalesPage";
import { DonneesPersonnellesPage } from "@features/legal/pages/DonneesPersonnellesPage";
import { GestionCookiesPage } from "@features/legal/pages/GestionCookiesPage";

function App() {
  return (
    <Layout>
      <Matomo />
      <ScrollToTop />
      <ErrorBoundary fallback={<ErrorFallbackPage />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SIMULATEURS} element={<SimulateursIndexPage />} />
          <Route
            path={ROUTES.DOCUMENTATION_REGLEMENTAIRE}
            element={<DocumentationReglementairePage />}
          />
          <Route path={ROUTES.DOC_ZONES} element={<ZonesReglementeesPage />} />
          <Route path={ROUTES.DOC_MARQUES} element={<MarquesPage />} />
          <Route path={ROUTES.DOC_TRAITEMENT} element={<TraitementAttenuationPage />} />
          <Route path={ROUTES.DOC_BIOSECURITE} element={<BiosecuriteNiveauxRisquePage />} />
          <Route path={ROUTES.DOC_AGREMENT_MCA} element={<AgrementMcaPage />} />
          <Route path={ROUTES.DOC_DOCUMENTS} element={<DocumentsAccompagnementPage />} />
          <Route path={ROUTES.DOC_CORPUS} element={<CorpusReglementairePage />} />
          <Route path={ROUTES.DOC_GLOSSAIRE} element={<GlossairePage />} />
          <Route
            path={ROUTES.NIVEAU_RISQUE}
            element={<Navigate to={ROUTES.DOC_BIOSECURITE} replace />}
          />
          <Route path={ROUTES.HISTORIQUE_VERSIONS} element={<HistoriqueVersionsPage />} />
          <Route path={ROUTES.PLAN_DU_SITE} element={<PlanDuSitePage />} />
          <Route path={ROUTES.ACCESSIBILITE} element={<AccessibilitePage />} />
          <Route path={ROUTES.MENTIONS_LEGALES} element={<MentionsLegalesPage />} />
          <Route path={ROUTES.DONNEES_PERSONNELLES} element={<DonneesPersonnellesPage />} />
          <Route path={ROUTES.GESTION_COOKIES} element={<GestionCookiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
