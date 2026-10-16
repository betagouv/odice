import type { ReactNode } from "react";
import { ROUTES } from "@shared/config/routes.config";
import { AvertissementNotice } from "@shared/components/AvertissementNotice";
import { Breadcrumb } from "@shared/components/Breadcrumb";
import { PageContainer } from "@shared/components/PageContainer";
import { PageTitle } from "@shared/components/PageTitle";
import type { Fiche } from "../fiches";

type FicheDocumentationProps = {
  fiche: Fiche;
  // Encadré « L'essentiel » en tête de fiche (absent sur le glossaire).
  essentiel?: ReactNode;
  children: ReactNode;
};

// Gabarit commun des fiches : fil d'Ariane, titre, « L'essentiel », contenu, avertissement.
export function FicheDocumentation({ fiche, essentiel, children }: FicheDocumentationProps) {
  return (
    <>
      <PageContainer avertissement>
        <PageTitle>{fiche.titre}</PageTitle>
        <Breadcrumb
          segments={[
            { label: "Accueil", to: ROUTES.HOME },
            { label: "Documentation réglementaire", to: ROUTES.DOCUMENTATION_REGLEMENTAIRE },
            { label: fiche.titre },
          ]}
        />

        <h1 className="fr-mt-2w">{fiche.titre}</h1>
        <hr />

        {essentiel && (
          // Fond bleu France de la maquette : le callout DSFR n'a pas de variante bleu France.
          <div className="fr-callout fr-my-4w bg-(--background-alt-blue-france)!">
            <h2 className="fr-callout__title">L'essentiel</h2>
            {/* div plutôt que p : l'encadré peut contenir une liste (Documents d'accompagnement). */}
            <div className="fr-callout__text">{essentiel}</div>
          </div>
        )}

        {children}
      </PageContainer>

      <AvertissementNotice />
    </>
  );
}

// Titre de section de fiche : taille commune à toutes les fiches.
export function TitreSection({ children }: { children: ReactNode }) {
  return <h2 className="fr-h5">{children}</h2>;
}
