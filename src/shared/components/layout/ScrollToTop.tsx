import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Le routeur conserve la position de défilement d'une page à l'autre : on repart du haut,
// sauf retour arrière (le navigateur restaure la position). Une ancre est atteinte après rendu,
// le navigateur l'ayant cherchée avant que la page n'existe (lien ouvert dans un nouvel onglet).
export function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
