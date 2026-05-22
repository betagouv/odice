import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { Layout } from "@shared/components/layout/Layout";
import { HomePage } from "@features/home/pages/HomePage";
import { SimulateursIndexPage } from "@features/simulateurs/pages/SimulateursIndexPage";
import { SimulateurAbattoirsPage } from "@features/simulateurs/abattoirs/pages/SimulateurAbattoirsPage";
import { SimulateurEtablissementsPage } from "@features/simulateurs/etablissements/pages/SimulateurEtablissementsPage";
import { DocumentationReglementairePage } from "@features/documentation/pages/DocumentationReglementairePage";
import { NoticeUtilisationPage } from "@features/documentation/pages/NoticeUtilisationPage";
import { PlanDuSitePage } from "@features/legal/pages/PlanDuSitePage";
import { AccessibilitePage } from "@features/legal/pages/AccessibilitePage";
import { MentionsLegalesPage } from "@features/legal/pages/MentionsLegalesPage";
import { DonneesPersonnellesPage } from "@features/legal/pages/DonneesPersonnellesPage";
import { GestionCookiesPage } from "@features/legal/pages/GestionCookiesPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SIMULATEURS} element={<SimulateursIndexPage />} />
        <Route path={ROUTES.SIMULATEUR_ABATTOIRS} element={<SimulateurAbattoirsPage />} />
        <Route path={ROUTES.SIMULATEUR_ETABLISSEMENTS} element={<SimulateurEtablissementsPage />} />
        <Route
          path={ROUTES.DOCUMENTATION_REGLEMENTAIRE}
          element={<DocumentationReglementairePage />}
        />
        <Route path={ROUTES.NOTICE_UTILISATION} element={<NoticeUtilisationPage />} />
        <Route path={ROUTES.PLAN_DU_SITE} element={<PlanDuSitePage />} />
        <Route path={ROUTES.ACCESSIBILITE} element={<AccessibilitePage />} />
        <Route path={ROUTES.MENTIONS_LEGALES} element={<MentionsLegalesPage />} />
        <Route path={ROUTES.DONNEES_PERSONNELLES} element={<DonneesPersonnellesPage />} />
        <Route path={ROUTES.GESTION_COOKIES} element={<GestionCookiesPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
