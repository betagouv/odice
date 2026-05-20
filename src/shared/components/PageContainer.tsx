import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

/**
 * Wrapper standard pour le contenu d'une page : applique le `fr-container` DSFR
 * et un padding vertical cohérent (`fr-py-6w`).
 *
 * Le `<main>` du Layout est volontairement nu pour permettre à certains composants
 * (Notice, hero plein écran, etc.) d'être posés en pleine largeur viewport. Les
 * pages contraignent leur contenu en l'enveloppant avec `<PageContainer>`.
 */
export function PageContainer({ children }: PageContainerProps) {
  return <div className="fr-container fr-py-6w">{children}</div>;
}
