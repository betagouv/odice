// Schémas « Évolution des phases et des zones » de la fiche Zones réglementées.
// Cercles en SVG (rendu fidèle à la maquette), jalons en HTML (texte lisible sur mobile).

import type { ReactNode } from "react";

// Teintes de la maquette, absentes du DSFR : dégradé de rouge des zones réglementées.
const ROUGE_FORT = "#FF8988";
const ROUGE_MOYEN = "#FFB0AF";
const ROUGE_CLAIR = "#FFE1E0";
const ROUGE_TRAIT = "#F24C4B";
const TEXTE = "#161616";

const CENTRE = 100;
const RAYON_EXTERNE = 92;
const RAYON_INTERNE = 60;

type Animal = "porc" | "sanglier";

type Zone = { sigle: string; precision?: string[] };

type CercleProps = {
  description: string;
  animal: Animal;
  // Positions des animaux (repère 0-200) : un ou deux selon la maquette.
  animaux: [number, number][];
  interne: Zone;
  // Couronne autour de la zone interne ; absente pour un disque simple (ZI FS).
  externe?: { zone: Zone; teinte: string };
};

function Cercle({ description, animal, animaux, interne, externe }: CercleProps) {
  const rayonInterne = externe ? RAYON_INTERNE : RAYON_EXTERNE;
  // Libellés centrés sur leur portion du rayon, à droite du virus.
  const xInterne = (CENTRE + 16 + CENTRE + rayonInterne) / 2;
  const xExterne = (CENTRE + RAYON_INTERNE + CENTRE + RAYON_EXTERNE) / 2;
  return (
    <svg
      viewBox="0 0 215 200"
      role="img"
      aria-label={description}
      className="mx-auto block h-auto w-full max-w-48 md:max-w-56"
    >
      {externe && (
        <circle
          cx={CENTRE}
          cy={CENTRE}
          r={RAYON_EXTERNE}
          fill={externe.teinte}
          stroke={ROUGE_TRAIT}
          strokeWidth={1.2}
          strokeDasharray="5 4"
        />
      )}
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={rayonInterne}
        fill={ROUGE_FORT}
        stroke={externe ? ROUGE_TRAIT : "none"}
        strokeWidth={1.2}
        strokeDasharray="5 4"
      />
      {animaux.map(([x, y]) => (
        <Silhouette key={`${x}-${y}`} animal={animal} x={x} y={y} />
      ))}
      <rect x={CENTRE} y={CENTRE - 10} width={112} height={externe ? 22 : 26} fill="#fff" />
      <LibelleZone zone={interne} x={xInterne} />
      {externe && <LibelleZone zone={externe.zone} x={xExterne} />}
      <Virus />
    </svg>
  );
}

function LibelleZone({ zone, x }: { zone: Zone; x: number }) {
  return (
    <text x={x} y={CENTRE - 1} textAnchor="middle" fill={TEXTE} fontFamily="inherit">
      <tspan fontSize={10} fontWeight={700}>
        {zone.sigle}
      </tspan>
      {zone.precision?.map((ligne, index) => (
        <tspan key={ligne} x={x} dy={index === 0 ? 8 : 6} fontSize={index === 0 ? 6.5 : 5.5}>
          {ligne}
        </tspan>
      ))}
    </text>
  );
}

function Virus() {
  const pointes = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <g stroke={TEXTE} strokeWidth={1.2}>
      {pointes.map((angle) => (
        <g key={angle}>
          <line
            x1={CENTRE + 10 * Math.cos(angle)}
            y1={CENTRE + 10 * Math.sin(angle)}
            x2={CENTRE + 15 * Math.cos(angle)}
            y2={CENTRE + 15 * Math.sin(angle)}
          />
          <circle
            cx={CENTRE + 17 * Math.cos(angle)}
            cy={CENTRE + 17 * Math.sin(angle)}
            r={2}
            fill="#fff"
          />
        </g>
      ))}
      <circle cx={CENTRE} cy={CENTRE} r={10} fill="#fff" />
      <text
        x={CENTRE}
        y={CENTRE + 2}
        textAnchor="middle"
        fontSize={5.5}
        fontWeight={700}
        fill={TEXTE}
        stroke="none"
        fontFamily="inherit"
      >
        PPA
      </text>
    </g>
  );
}

// Silhouettes blanches simplifiées (porc domestique, sanglier), tête à droite.
function Silhouette({ animal, x, y }: { animal: Animal; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="#fff">
      {animal === "porc" ? (
        <>
          <ellipse cx={0} cy={0} rx={13} ry={8.5} />
          <circle cx={11} cy={-2.5} r={6} />
          <rect x={15.5} y={-4.5} width={4} height={4.5} rx={1.2} />
          <path d="M8 -7 L11 -13 L13.5 -7 Z" />
          <path d="M-13 -2 q-4 -1 -3 -5" stroke="#fff" strokeWidth={1.5} fill="none" />
        </>
      ) : (
        <>
          <path d="M-13 1 Q-14 -7 -5 -9 Q3 -12 9 -7 L9 6 Q0 8 -9 7 Q-13 6 -13 1 Z" />
          <path d="M6 -8 Q12 -7 16 -2 L23 1.5 L22.5 4 L14 4.5 Q9 6 6 5 Z" />
          <path d="M9 -7 L10.5 -12 L13 -6 Z" />
          <path d="M18 3 q1.5 -2.5 0 -4.5" stroke={ROUGE_FORT} strokeWidth={0.9} fill="none" />
          <path d="M-13 -1 l-3 3" stroke="#fff" strokeWidth={1.2} />
        </>
      )}
      {[-10, -5, 4, 9].map((xPatte) => (
        <rect
          key={xPatte}
          x={xPatte}
          y={4}
          width={animal === "porc" ? 3.5 : 2.5}
          height={8}
          rx={1}
        />
      ))}
    </g>
  );
}

// Jalons d'une branche du schéma, reliés par un trait pointillé vertical.
function Branche({ libelle, children }: { libelle: string; children: ReactNode }) {
  return (
    <ol
      aria-label={libelle}
      className="m-0! flex list-none! flex-col items-center p-0! text-center [&>li+li]:before:block [&>li+li]:before:h-5 [&>li+li]:before:border-l [&>li+li]:before:border-dashed [&>li+li]:before:content-['']"
    >
      {children}
    </ol>
  );
}

const JALON = "flex flex-col items-center p-0!";

function Jour({ children }: { children: string }) {
  return (
    <li className={JALON}>
      <span className="fr-text--sm fr-mb-0">{children}</span>
    </li>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <li className={JALON}>
      <span className="fr-text--xs fr-mb-0 max-w-40">{children}</span>
    </li>
  );
}

function Evenement({ children }: { children: string }) {
  return (
    <li className={JALON}>
      <span
        className="fr-text--xs fr-mb-0 max-w-44 px-3 py-1"
        // Fond rose de la maquette, aligné sur les couronnes des schémas.
        style={{ backgroundColor: ROUGE_CLAIR }}
      >
        {children}
      </span>
    </li>
  );
}

function Phase({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="w-full">
      <p className="fr-text--sm fr-mb-1w font-bold">{titre}</p>
      {children}
    </div>
  );
}

function JalonPhase({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <li className={`${JALON} w-full`}>
      <Phase titre={titre}>{children}</Phase>
    </li>
  );
}

function Schema({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="fr-mb-4w">
      <h3 className="fr-h6 fr-mb-2w">{titre}</h3>
      <div className="max-w-2xl border border-(--border-default-grey) p-4 text-center md:p-8">
        {children}
      </div>
    </section>
  );
}

const ZONE_FS_AJUSTEE: Zone = {
  sigle: "ZI FS",
  precision: ["ajustée en fonction", "de la surveillance"],
};

const CERCLE_FAUNE_URGENCE = (
  <Cercle
    description="Zone infectée faune sauvage, ajustée en fonction de la surveillance, autour du cas de PPA."
    animal="sanglier"
    animaux={[[90, 50]]}
    interne={ZONE_FS_AJUSTEE}
  />
);

export function SchemaFoyerElevage() {
  return (
    <Schema titre="Foyer en élevage">
      <Phase titre="Phase mesures d'urgence">
        <Cercle
          description="Zone de protection de 3 km entourée d'une zone de surveillance de 10 km autour du foyer de PPA."
          animal="porc"
          animaux={[[92, 62]]}
          interne={{ sigle: "ZP", precision: ["3 km"] }}
          externe={{ zone: { sigle: "ZS", precision: ["10 km"] }, teinte: ROUGE_MOYEN }}
        />
      </Phase>
      <div className="grid grid-cols-2 gap-4">
        <Branche libelle="Sans nouveau foyer">
          <Jour>J 1</Jour>
          <Note>Pas de nouveau foyer</Note>
          <Note>Maintien des zones</Note>
          <Jour>J +90</Jour>
          <Note>Levée des zones</Note>
        </Branche>
        <Branche libelle="Avec nouveau foyer">
          <Jour>J 1</Jour>
          <Evenement>Déclaration d'un nouveau foyer ou plus</Evenement>
          <Jour>J +30</Jour>
          <JalonPhase titre="Phase de régionalisation">
            <Cercle
              description="Zone réglementée III autour du foyer, entourée d'une zone réglementée I."
              animal="porc"
              animaux={[
                [96, 68],
                [96, 135],
              ]}
              interne={{ sigle: "ZRIII" }}
              externe={{ zone: { sigle: "ZRI" }, teinte: ROUGE_CLAIR }}
            />
          </JalonPhase>
          <Jour>J +365</Jour>
          <Note>
            Levée des mesures <strong>un an</strong> après découverte du dernier foyer
          </Note>
        </Branche>
      </div>
    </Schema>
  );
}

export function SchemaFauneSauvage() {
  return (
    <Schema titre="Cas en faune sauvage">
      <Phase titre="Phase réflexe">
        <Cercle
          description="Zone infectée faune sauvage réflexe de 20 km autour du cas de PPA."
          animal="sanglier"
          animaux={[[90, 50]]}
          interne={{ sigle: "ZI FS réflexe", precision: ["20 km"] }}
        />
      </Phase>
      <div className="grid grid-cols-2 gap-4">
        <Branche libelle="Sans nouveau cas">
          <Jour>J 1</Jour>
          <Note>Maintien de la zone pour évaluation de la situation</Note>
          <Jour>J +3</Jour>
          <JalonPhase titre="Phase mesures d'urgence">{CERCLE_FAUNE_URGENCE}</JalonPhase>
          <Note>Pas de nouveaux cas</Note>
          <Jour>J +365</Jour>
          <Note>
            Maintien de la zone a minima <strong>un an</strong>
          </Note>
        </Branche>
        <Branche libelle="Avec nouveau cas">
          <Jour>J 1</Jour>
          <Note>Maintien de la zone pour évaluation de la situation</Note>
          <Jour>J +3</Jour>
          <JalonPhase titre="Phase mesures d'urgence">{CERCLE_FAUNE_URGENCE}</JalonPhase>
          <Evenement>Déclaration d'un nouveau cas ou plus</Evenement>
          <Jour>J +30</Jour>
          <JalonPhase titre="Phase de régionalisation">
            <Cercle
              description="Zone réglementée II autour du cas de PPA, entourée d'une zone réglementée I."
              animal="sanglier"
              animaux={[
                [100, 62],
                [58, 112],
              ]}
              interne={{ sigle: "ZRII" }}
              externe={{ zone: { sigle: "ZRI" }, teinte: ROUGE_CLAIR }}
            />
          </JalonPhase>
          <Jour>J +365</Jour>
          <Note>
            Levée des mesures <strong>un an</strong> après découverte du dernier cas
          </Note>
        </Branche>
      </div>
    </Schema>
  );
}
