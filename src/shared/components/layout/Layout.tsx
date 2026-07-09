import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { ROUTES } from "@shared/config/routes.config";
import { APP_VERSION } from "@shared/config/version.config";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <p className="fr-logo">
                      Ministère <br />
                      de l’agriculture <br />
                      de l’agro-alimentaire <br />
                      et de la souveraineté <br />
                      alimentaire
                    </p>
                  </div>
                  <div className="fr-header__operator">
                    <img
                      className="fr-responsive-img"
                      src="/logo/logo.png"
                      alt="Odicé"
                      style={{ maxWidth: "5rem" }}
                    />
                  </div>
                  <div className="fr-header__navbar">
                    <button
                      type="button"
                      className="fr-btn--menu fr-btn"
                      data-fr-opened="false"
                      aria-controls="modal-menu"
                      aria-haspopup="menu"
                      title="Menu"
                    >
                      Menu
                    </button>
                  </div>
                </div>
                <div className="fr-header__service">
                  <Link to={ROUTES.HOME} title="Accueil - Odicé">
                    <p className="fr-header__service-title">
                      Odicé{" "}
                      <span className="fr-badge fr-badge--sm fr-badge--green-emeraude fr-ml-1w">
                        BETA
                      </span>
                    </p>
                  </Link>
                  <p className="fr-header__service-tagline">
                    Garantir la conformité des mouvements en contexte de crise sanitaire <br />
                    Édition PPA (Peste Porcine Africaine)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fr-header__menu fr-modal" id="modal-menu" aria-labelledby="button-menu">
          <div className="fr-container">
            <button
              type="button"
              className="fr-btn--close fr-btn"
              aria-controls="modal-menu"
              title="Fermer"
            >
              Fermer
            </button>
            <nav className="fr-nav" role="navigation" aria-label="Menu principal">
              <ul className="fr-nav__list">
                <li className="fr-nav__item">
                  <NavLink to={ROUTES.HOME} end className="fr-nav__link">
                    Accueil
                  </NavLink>
                </li>
                <li className="fr-nav__item">
                  <NavLink to={ROUTES.SIMULATEURS} className="fr-nav__link">
                    Simulateur
                  </NavLink>
                </li>
                <li className="fr-nav__item">
                  <NavLink to={ROUTES.DOCUMENTATION_REGLEMENTAIRE} className="fr-nav__link">
                    Documentation réglementaire
                  </NavLink>
                </li>
                <li className="fr-nav__item">
                  <NavLink to={ROUTES.AIDE_UTILISATION} className="fr-nav__link">
                    Aide à l'utilisation
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main role="main" id="main">
        {children}
      </main>

      <footer className="fr-footer" role="contentinfo" id="footer">
        <div className="fr-container">
          <div className="fr-footer__body">
            <div className="fr-footer__brand fr-enlarge-link">
              <Link to={ROUTES.HOME} title="Retour à l'accueil - Ministère de l'Agriculture">
                <p className="fr-logo">
                  Ministère <br />
                  de l’agriculture <br />
                  de l’agro-alimentaire <br />
                  et de la souveraineté <br />
                  alimentaire
                </p>
              </Link>
            </div>
            <div className="fr-footer__content">
              <p className="fr-footer__content-desc">
                Odicé est un outil d’aide à la décision à destination des professionnels des
                abattoirs et des établissements de transformation du secteur alimentaire, ainsi que
                des agents en DDPP.
              </p>
              <ul className="fr-footer__content-list">
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    target="_blank"
                    rel="noopener external noreferrer"
                    title="info.gouv.fr - nouvelle fenêtre"
                    href="https://info.gouv.fr"
                  >
                    info.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    target="_blank"
                    rel="noopener external noreferrer"
                    title="service-public.fr - nouvelle fenêtre"
                    href="https://service-public.fr"
                  >
                    service-public.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    target="_blank"
                    rel="noopener external noreferrer"
                    title="legifrance.gouv.fr - nouvelle fenêtre"
                    href="https://legifrance.gouv.fr"
                  >
                    legifrance.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__content-link"
                    target="_blank"
                    rel="noopener external noreferrer"
                    title="data.gouv.fr - nouvelle fenêtre"
                    href="https://data.gouv.fr"
                  >
                    data.gouv.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="fr-footer__bottom">
            <ul className="fr-footer__bottom-list">
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" to={ROUTES.PLAN_DU_SITE}>
                  Plan du site
                </Link>
              </li>

              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" to={ROUTES.ACCESSIBILITE}>
                  Accessibilité : non conforme
                </Link>
              </li>
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" to={ROUTES.MENTIONS_LEGALES}>
                  Mentions légales
                </Link>
              </li>
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" to={ROUTES.DONNEES_PERSONNELLES}>
                  Données personnelles
                </Link>
              </li>
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" to={ROUTES.GESTION_COOKIES}>
                  Gestion des cookies
                </Link>
              </li>
              <li className="fr-footer__bottom-item">
                <Link className="fr-footer__bottom-link" to={ROUTES.HISTORIQUE_VERSIONS}>
                  Historique des versions
                </Link>
              </li>
              <li className="fr-footer__bottom-item">
                <span className="fr-footer__bottom-link">Version {APP_VERSION}</span>
              </li>
            </ul>
            <div className="fr-footer__bottom-copy">
              <p>
                Sauf mention contraire, tous les contenus de ce site sont sous{" "}
                <a
                  href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                  target="_blank"
                  rel="noopener external noreferrer"
                  title="Licence etalab-2.0 - nouvelle fenêtre"
                >
                  licence etalab-2.0
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
