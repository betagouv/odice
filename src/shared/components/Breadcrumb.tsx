import { useId } from "react";
import { Link } from "react-router-dom";

export type BreadcrumbSegment = {
  label: string;
  /** Si absent, le segment est considéré comme la page courante (aria-current="page"). */
  to?: string;
};

type BreadcrumbProps = {
  segments: BreadcrumbSegment[];
};

export function Breadcrumb({ segments }: BreadcrumbProps) {
  const collapseId = useId();
  return (
    <nav role="navigation" className="fr-breadcrumb" aria-label="vous êtes ici :">
      <button
        type="button"
        className="fr-breadcrumb__button"
        aria-expanded="false"
        aria-controls={collapseId}
      >
        Voir le fil d'Ariane
      </button>
      <div className="fr-collapse" id={collapseId}>
        <ol className="fr-breadcrumb__list">
          {segments.map((segment, index) => {
            const isCurrent = !segment.to;
            return (
              <li key={`${segment.label}-${index}`}>
                {isCurrent ? (
                  <a className="fr-breadcrumb__link" aria-current="page">
                    {segment.label}
                  </a>
                ) : (
                  <Link className="fr-breadcrumb__link" to={segment.to as string}>
                    {segment.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
