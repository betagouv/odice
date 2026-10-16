import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Le routeur conserve la position de défilement d'une page à l'autre : on repart du haut,
// sauf retour arrière (le navigateur restaure la position) ou lien vers une ancre.
export function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash || navigationType === "POP") return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
