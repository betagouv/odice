import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  // Page suivie du bandeau d'avertissement : garantit 100 px au moins entre le contenu et le bandeau.
  avertissement?: boolean;
};

/**
 * Wrapper standard pour le contenu d'une page : applique le `fr-container` DSFR
 * et un padding vertical cohérent (`fr-py-6w`).
 *
 * Le `<main>` du Layout est volontairement nu pour permettre à certains composants
 * (Notice, hero plein écran, etc.) d'être posés en pleine largeur viewport. Les
 * pages contraignent leur contenu en l'enveloppant avec `<PageContainer>`.
 */
export function PageContainer({ children, avertissement = false }: PageContainerProps) {
  const bas = avertissement ? "pb-[100px]" : "fr-pb-6w";
  return <div className={`fr-container fr-pt-6w ${bas}`}>{children}</div>;
}
