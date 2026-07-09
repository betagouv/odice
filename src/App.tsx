import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { ErrorBoundary } from "@shared/components/ErrorBoundary";
import { Layout } from "@shared/components/layout/Layout";
import { Matomo } from "@shared/analytics";
import { HomePage } from "@features/home/pages/HomePage";
import { SimulateursIndexPage } from "@features/simulateurs/pages/SimulateursIndexPage";
import { DocumentationReglementairePage } from "@features/documentation/pages/DocumentationReglementairePage";
import { AideUtilisationPage } from "@features/documentation/pages/AideUtilisationPage";
import { HistoriqueVersionsPage } from "@features/historique/pages/HistoriqueVersionsPage";
import { ErrorFallbackPage } from "@features/error/pages/ErrorFallbackPage";
import { PlanDuSitePage } from "@features/legal/pages/PlanDuSitePage";
import { AccessibilitePage } from "@features/legal/pages/AccessibilitePage";
import { MentionsLegalesPage } from "@features/legal/pages/MentionsLegalesPage";
import { DonneesPersonnellesPage } from "@features/legal/pages/DonneesPersonnellesPage";
import { GestionCookiesPage } from "@features/legal/pages/GestionCookiesPage";

function App() {
  return (
    <Layout>
      <Matomo />
      <ErrorBoundary fallback={<ErrorFallbackPage />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SIMULATEURS} element={<SimulateursIndexPage />} />
          <Route
            path={ROUTES.DOCUMENTATION_REGLEMENTAIRE}
            element={<DocumentationReglementairePage />}
          />
          <Route path={ROUTES.AIDE_UTILISATION} element={<AideUtilisationPage />} />
          <Route path={ROUTES.HISTORIQUE_VERSIONS} element={<HistoriqueVersionsPage />} />
          <Route path={ROUTES.PLAN_DU_SITE} element={<PlanDuSitePage />} />
          <Route path={ROUTES.ACCESSIBILITE} element={<AccessibilitePage />} />
          <Route path={ROUTES.MENTIONS_LEGALES} element={<MentionsLegalesPage />} />
          <Route path={ROUTES.DONNEES_PERSONNELLES} element={<DonneesPersonnellesPage />} />
          <Route path={ROUTES.GESTION_COOKIES} element={<GestionCookiesPage />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
