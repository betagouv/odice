// Schémas « Évolution des phases et des zones » de la fiche Zones réglementées (exports Figma).
// Le texte de l'image est repris en liste masquée pour les lecteurs d'écran (RGAA).

type Branche = { libelle: string; etapes: string[] };

type SchemaProps = {
  titre: string;
  image: string;
  largeur: number;
  hauteur: number;
  phaseInitiale: string;
  branches: Branche[];
};

function Schema({ titre, image, largeur, hauteur, phaseInitiale, branches }: SchemaProps) {
  return (
    <section className="fr-mb-4w">
      <h3 className="fr-h6 fr-mb-2w">{titre}</h3>
      <figure className="fr-m-0 max-w-2xl border border-(--border-default-grey) p-4 md:p-8">
        <img
          src={image}
          alt=""
          width={largeur}
          height={hauteur}
          className="mx-auto block h-auto w-full max-w-xl"
          loading="lazy"
        />
        <figcaption className="fr-sr-only">
          <p>
            {titre} : {phaseInitiale}
          </p>
          {branches.map((branche) => (
            <ol key={branche.libelle} aria-label={branche.libelle}>
              {branche.etapes.map((etape) => (
                <li key={etape}>{etape}</li>
              ))}
            </ol>
          ))}
        </figcaption>
      </figure>
    </section>
  );
}

export function SchemaFoyerElevage() {
  return (
    <Schema
      titre="Foyer en élevage"
      image="/images/documentation/zones-foyer-elevage.webp"
      largeur={1180}
      hauteur={1564}
      phaseInitiale="phase mesures d'urgence, avec une zone de protection (ZP) de 3 km entourée d'une zone de surveillance (ZS) de 10 km autour du foyer de PPA."
      branches={[
        {
          libelle: "Sans nouveau foyer",
          etapes: ["J 1 : pas de nouveau foyer, maintien des zones", "J +90 : levée des zones"],
        },
        {
          libelle: "Avec nouveau foyer",
          etapes: [
            "J 1 : déclaration d'un nouveau foyer ou plus",
            "J +30 : phase de régionalisation, avec une zone réglementée III (ZRIII) autour du foyer, entourée d'une zone réglementée I (ZRI)",
            "J +365 : levée des mesures un an après la découverte du dernier foyer",
          ],
        },
      ]}
    />
  );
}

export function SchemaFauneSauvage() {
  return (
    <Schema
      titre="Cas en faune sauvage"
      image="/images/documentation/zones-faune-sauvage.webp"
      largeur={1248}
      hauteur={2412}
      phaseInitiale="phase réflexe, avec une zone infectée faune sauvage réflexe (ZI FS réflexe) de 20 km autour du cas de PPA."
      branches={[
        {
          libelle: "Sans nouveau cas",
          etapes: [
            "J 1 : maintien de la zone pour évaluation de la situation",
            "J +3 : phase mesures d'urgence, avec une zone infectée faune sauvage (ZI FS) ajustée en fonction de la surveillance",
            "pas de nouveaux cas",
            "J +365 : maintien de la zone a minima un an",
          ],
        },
        {
          libelle: "Avec nouveau cas",
          etapes: [
            "J 1 : maintien de la zone pour évaluation de la situation",
            "J +3 : phase mesures d'urgence, avec une zone infectée faune sauvage (ZI FS) ajustée en fonction de la surveillance",
            "déclaration d'un nouveau cas ou plus",
            "J +30 : phase de régionalisation, avec une zone réglementée II (ZRII) autour du cas, entourée d'une zone réglementée I (ZRI)",
            "J +365 : levée des mesures un an après la découverte du dernier cas",
          ],
        },
      ]}
    />
  );
}
