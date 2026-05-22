import type { ReactNode } from "react";

export type NoticeVariant = "warning" | "info" | "success";

type NoticeProps = {
  title: string;
  children: ReactNode;
  variant?: NoticeVariant;
};

/**
 * Bandeau d'information / d'avertissement DSFR (`.fr-notice`).
 *
 * Astuce : le pattern DSFR met title et description dans des `<span>` côte à côte.
 * On force le titre en `display: block` (utilitaire Tailwind `block`) pour que la
 * description s'affiche sur une ligne dédiée en dessous — sans casser la sémantique
 * ni les styles DSFR.
 */
export function Notice({ title, children, variant = "warning" }: NoticeProps) {
  return (
    <div className={`fr-notice fr-notice--${variant}`}>
      <div className="fr-container">
        <div className="fr-notice__body">
          <p className="fr-m-0">
            <span className="fr-notice__title block">{title}</span>
            <span className="fr-notice__desc">{children}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
