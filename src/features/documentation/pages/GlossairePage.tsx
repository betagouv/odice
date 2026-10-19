import type { ReactNode } from "react";
import { FicheDocumentation } from "../components/FicheDocumentation";
import { FICHE_GLOSSAIRE, ancreTerme } from "../fiches";

type Terme = { terme: string; paragraphes: ReactNode[] };

const TERMES: Terme[] = [
  {
    terme: "Agrément zoosanitaire MCA",
    paragraphes: [
      "Agrément zoosanitaire délivré aux établissements du secteur alimentaire concernés par la gestion de produits soumis à des restrictions liées à une maladie de catégorie A.",
      "En contexte PPA, il permet notamment à certains établissements de recevoir, manipuler, découper, transformer ou entreposer des viandes soumises à restriction dans les conditions prévues par la réglementation.",
      <strong key="essentiel">MCA = Maladie de catégorie A.</strong>,
    ],
  },
  {
    terme: "Biosécurité",
    paragraphes: [
      "Ensemble des mesures permettant de prévenir l'introduction, la diffusion ou la propagation du virus de la PPA.",
      "Elle concerne notamment la gestion des flux, le nettoyage et la désinfection, les personnes, les véhicules, les équipements et les produits.",
    ],
  },
  {
    terme: "Certificat zoosanitaire",
    paragraphes: [
      "Document officiel attestant que l'envoi respecte les exigences de santé animale applicables à son mouvement.",
      "Il est requis dans les situations prévues par la réglementation européenne. Des dérogations à l'obligation de certification sont possibles dans certaines situations.",
    ],
  },
  {
    terme: "Dérogation",
    paragraphes: [
      "Disposition réglementaire permettant d'autoriser un mouvement ou de déroger à une obligation normalement applicable, sous réserve du respect de conditions précises.",
      <strong key="essentiel">
        Une dérogation ne signifie pas une absence de conditions : le mouvement reste soumis aux
        exigences prévues par la réglementation.
      </strong>,
    ],
  },
  {
    terme: "DDecPP",
    paragraphes: [
      <strong key="essentiel">
        Direction départementale en charge de la protection des populations.
      </strong>,
      "Service de l'État compétent notamment pour la mise en œuvre et le contrôle des mesures sanitaires applicables aux établissements du secteur alimentaire.",
    ],
  },
  {
    terme: "Établissement désigné",
    paragraphes: [
      "Établissement reconnu par l'autorité compétente comme répondant aux exigences permettant de recevoir ou de traiter certains animaux ou produits soumis à des restrictions de police sanitaire.",
      "En France, cette désignation se traduit notamment par la délivrance de l'agrément zoosanitaire MCA.",
    ],
  },
  {
    terme: "Établissement du secteur alimentaire",
    paragraphes: [
      "Établissement dans lequel sont exercées des activités liées aux denrées alimentaires d'origine animale : abattage, découpe, transformation, entreposage, etc.",
      "Selon l'activité et le circuit envisagé, l'établissement peut être soumis à des obligations d'agrément sanitaire et d'agrément zoosanitaire MCA.",
    ],
  },
  {
    terme: "Laissez-passer sanitaire (LPS)",
    paragraphes: [
      "Document permettant de formaliser l'autorisation de certains mouvements de produits soumis à restriction.",
      "Selon le circuit, le LPS peut être exigé pour chaque mouvement (LPS systématique) ou être remplacé par un LPS permanent lorsque les conditions prévues sont respectées.",
    ],
  },
  {
    terme: "LPS permanent",
    paragraphes: [
      "Autorisation permettant de couvrir des mouvements répétés entre un établissement d'origine et un établissement de destination déterminés, lorsque les conditions prévues sont respectées.",
      "Un registre des mouvements doit notamment être tenu dans les situations concernées.",
    ],
  },
  {
    terme: "LPS systématique",
    paragraphes: ["Laissez-passer sanitaire devant être établi pour chaque mouvement concerné."],
  },
  {
    terme: "Marque ovale",
    paragraphes: [
      "Marque de salubrité ou d'identification de forme ovale.",
      <>
        Dans le contexte de la PPA, une viande portant cette marque peut être considérée comme une{" "}
        <strong>viande sans restriction</strong> vis-à-vis de la PPA, sous réserve des autres
        conditions réglementaires applicables.
      </>,
    ],
  },
  {
    terme: "Marque ovale à diagonales parallèles",
    paragraphes: [
      "Marque spéciale de salubrité ou d'identification apposée sur certaines viandes soumises à restriction dans le contexte de la PPA.",
      "Elle permet d'identifier les viandes auxquelles des conditions particulières de circulation et de mise sur le marché sont applicables.",
    ],
  },
  {
    terme: "Marque ovale barrée",
    paragraphes: [
      "Marque spéciale de salubrité ou d'identification apposée sur certaines viandes soumises à restriction dans le contexte de la PPA.",
      "Elle permet d'identifier les viandes auxquelles des conditions particulières de circulation et de mise sur le marché sont applicables.",
    ],
  },
  {
    terme: "MNR-PPA",
    paragraphes: [
      <strong key="essentiel">
        Mouvements des animaux non reconnus comme appliquant les dispositions réglementaires
        vis-à-vis de la PPA.
      </strong>,
      "Cette notion concerne les porcins détenus provenant d'une zone réglementée dont les conditions de détention et/ou de sortie ne répondent pas aux dispositions réglementaires applicables.",
    ],
  },
  {
    terme: "MR-PPA",
    paragraphes: [
      <strong key="essentiel">
        Mouvements des animaux reconnus comme appliquant les dispositions réglementaires vis-à-vis
        de la PPA.
      </strong>,
      "Cette notion concerne les porcins détenus provenant d'une zone réglementée dont les conditions de détention et de sortie respectent les dispositions réglementaires applicables.",
    ],
  },
  {
    terme: "Séparation des flux",
    paragraphes: [
      "Organisation des flux de produits, de personnes, de matériels et de véhicules permettant d'éviter les contaminations croisées entre produits présentant des statuts sanitaires différents.",
      <>
        La séparation peut être <strong>physique ou temporelle</strong>, selon les situations.
      </>,
    ],
  },
  {
    terme: "Traitement d'atténuation",
    paragraphes: [
      "Traitement appliqué à certains produits d'origine animale afin de réduire le risque de propagation de la PPA.",
      "Les traitements reconnus et leurs conditions sont définis par la réglementation, notamment à l'annexe VII du règlement délégué (UE) 2020/687.",
    ],
  },
  {
    terme: "Viande sans restriction",
    paragraphes: [
      <>
        Viande portant une <strong>marque ovale</strong>.
      </>,
    ],
  },
  {
    terme: "Viande soumise à restriction",
    paragraphes: [
      "Viande issue d'animaux soumis à restriction et portant une marque spéciale.",
      <>
        Selon la situation, elle peut notamment porter une{" "}
        <strong>marque ovale barrée ou une marque ovale à diagonales parallèles</strong>.
      </>,
    ],
  },
];

const ZONES_SANITAIRES: Terme[] = [
  {
    terme: "Zone de protection (ZP)",
    paragraphes: [
      "Zone établie autour d'un foyer de PPA chez des porcins détenus, conformément aux règles de lutte contre la maladie.",
      "Elle est soumise à des mesures de lutte et de surveillance spécifiques.",
    ],
  },
  {
    terme: "Zone de surveillance (ZS)",
    paragraphes: [
      "Zone établie autour d'une zone de protection lors d'un foyer de PPA chez des porcins détenus.",
      "Elle est soumise à des mesures de surveillance et de lutte spécifiques.",
    ],
  },
  {
    terme: "Zone indemne",
    paragraphes: [
      "Zone dans laquelle aucune mesure de restriction vis-à-vis de la PPA n'est applicable.",
      "Les porcs et les viandes provenant de zone indemne ne sont pas soumis aux restrictions PPA, sous réserve des autres règles sanitaires applicables.",
    ],
  },
  {
    terme:
      "Zone infectée faune sauvage réflexe et zone infectée faune sauvage (ZI FS réflexe et ZI FS)",
    paragraphes: [
      "Zone établie à la suite de la confirmation d'un cas de PPA, notamment chez un suidé sauvage.",
      "Elle est soumise aux mesures de lutte prévues par la réglementation.",
    ],
  },
  {
    terme: "Zone réglementée I (ZRI)",
    paragraphes: [
      "Zone faisant l'objet de mesures particulières de lutte contre la PPA et située en bordure de zones réglementées II ou III.",
      "Elle présente un niveau de risque inférieur aux zones réglementées II et III.",
    ],
  },
  {
    terme: "Zone réglementée II (ZRII)",
    paragraphes: [
      "Zone faisant l'objet de mesures particulières de lutte contre la PPA en raison notamment de la présence de la maladie chez les suidés sauvages.",
    ],
  },
  {
    terme: "Zone réglementée III (ZRIII)",
    paragraphes: [
      "Zone faisant l'objet de mesures particulières de lutte contre la PPA en raison notamment de la présence de la maladie chez les porcs détenus.",
      "Elle correspond à la situation présentant le niveau de risque le plus élevé parmi les zones réglementées I, II et III.",
    ],
  },
];

export function GlossairePage() {
  return (
    <FicheDocumentation fiche={FICHE_GLOSSAIRE}>
      {TERMES.map((terme) => (
        <Definition key={terme.terme} {...terme} niveau="h2" />
      ))}

      <section className="fr-mt-6w">
        <h2 className="fr-h4">Zones sanitaires</h2>
        {ZONES_SANITAIRES.map((terme) => (
          <Definition key={terme.terme} {...terme} niveau="h3" />
        ))}
      </section>
    </FicheDocumentation>
  );
}

// Les termes des zones sont des sous-titres de « Zones sanitaires », au même style visuel.
function Definition({ terme, paragraphes, niveau }: Terme & { niveau: "h2" | "h3" }) {
  const Titre = niveau;
  return (
    <section className="fr-mt-4w">
      <Titre className="fr-h5" id={ancreTerme(terme)}>
        {terme}
      </Titre>
      {paragraphes.map((paragraphe, index) => (
        <p key={index}>{paragraphe}</p>
      ))}
      <hr />
    </section>
  );
}
