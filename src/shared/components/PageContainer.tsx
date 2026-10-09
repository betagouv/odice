import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  // Page suivie du bandeau d'avertissement : garantit 100 px au moins entre le contenu et le bandeau.
  avertissement?: boolean;
  // Marge haute réduite sous le menu (accueil).
  espaceHaut?: "normal" | "reduit";
};

/**
 * Wrapper standard pour le contenu d'une page : applique le `fr-container` DSFR
 * et un padding vertical cohérent (`fr-py-6w`).
 *
 * Le `<main>` du Layout est volontairement nu pour permettre à certains composants
 * (Notice, hero plein écran, etc.) d'être posés en pleine largeur viewport. Les
 * pages contraignent leur contenu en l'enveloppant avec `<PageContainer>`.
 */
export function PageContainer({
  children,
  avertissement = false,
  espaceHaut = "normal",
}: PageContainerProps) {
  const haut = espaceHaut === "reduit" ? "fr-pt-4w" : "fr-pt-6w";
  const bas = avertissement ? "pb-[100px]" : "fr-pb-6w";
  return <div className={`fr-container ${haut} ${bas}`}>{children}</div>;
}
