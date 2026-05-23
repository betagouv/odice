// Titre de page (onglet navigateur + a11y).
// React 19 hoist <title> natif vers <head>, pas besoin de react-helmet.

type Props = { children: string };

export function PageTitle({ children }: Props) {
  return <title>{`${children} — ODICE`}</title>;
}
