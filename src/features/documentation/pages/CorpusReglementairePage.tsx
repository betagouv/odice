import { useId } from "react";
import { FicheDocumentation } from "../components/FicheDocumentation";
import { FICHE_CORPUS } from "../fiches";

type Texte = {
  titre: string;
  intitule: string;
  url: string;
  resume: string[];
  motsCles: string[];
  // Lien hébergé sur le réseau interministériel (RIE), inaccessible au grand public.
  diffusionLimitee?: boolean;
};

type Groupe = { titre: string; textes: Texte[] };

const REGLEMENTS_EUROPEENS: Texte[] = [
  {
    titre: "Règlement (CE) n° 853/2004",
    intitule:
      "Règlement (CE) n° 853/2004 du Parlement européen et du Conseil du 29 avril 2004 fixant des règles spécifiques d'hygiène applicables aux denrées alimentaires d'origine animale",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32004R0853",
    resume: [
      "Le règlement (CE) n° 853/2004 établit des règles spécifiques d'hygiène applicables aux denrées alimentaires d'origine animale et fixe notamment des exigences applicables aux établissements qui les produisent et les manipulent.",
      "Concernant les marques, il définit les règles relatives à la marque d'identification apposée sur les produits d'origine animale. Cette marque permet notamment d'identifier l'établissement agréé à l'origine du produit grâce à son pays et à son numéro d'agrément.",
    ],
    motsCles: [
      "marque d'identification",
      "établissement agréé",
      "numéro d'agrément",
      "traçabilité",
      "produits d'origine animale",
    ],
  },
  {
    titre: "Règlement (UE) 2016/429",
    intitule:
      "Règlement (UE) 2016/429 du Parlement européen et du Conseil du 9 mars 2016 relatif aux maladies animales transmissibles et modifiant et abrogeant certains actes dans le domaine de la santé animale (« législation sur la santé animale »)",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0429",
    resume: [
      "Texte fondateur du droit européen de la santé animale, il établit un cadre unifié pour la prévention et la lutte contre les maladies animales transmissibles. Définit les obligations des détenteurs d'animaux et des exploitants du secteur alimentaire, les règles de mouvements, de traçabilité et les mesures de lutte en cas de foyer. Constitue la base légale de la grande majorité des textes subséquents en matière de santé animale.",
    ],
    motsCles: [
      "santé animale",
      "maladies transmissibles",
      "prévention",
      "lutte",
      "mouvements d'animaux et de produits",
    ],
  },
  {
    titre: "Règlement d'exécution (UE) 2018/1882",
    intitule:
      "Règlement d'exécution (UE) 2018/1882 de la Commission du 3 décembre 2018 sur l'application de certaines dispositions en matière de prévention et de lutte contre les maladies à des catégories de maladies répertoriées et établissant une liste des espèces et des groupes d'espèces qui présentent un risque considérable du point de vue de la propagation de ces maladies répertoriées",
    url: "https://eur-lex.europa.eu/eli/reg_impl/2018/1882/oj?locale=fr",
    resume: [
      "Applique les dispositions du règlement 2016/429 en établissant une liste des maladies animales répertoriées par catégorie selon leur mode de gestion réglementaire. Associe à chaque maladie les espèces et groupes d'espèces présentant un risque significatif de propagation.",
    ],
    motsCles: ["maladies répertoriées", "espèces à risque", "catégorisation", "application"],
  },
  {
    titre: "Règlement d'exécution (UE) 2019/627",
    intitule:
      "Règlement d'exécution (UE) 2019/627 de la Commission du 15 mars 2019 établissant des modalités uniformes pour la réalisation des contrôles officiels en ce qui concerne les produits d'origine animale destinés à la consommation humaine conformément au règlement (UE) 2017/625 du Parlement européen et du Conseil et modifiant le règlement (CE) n° 2074/2005 de la Commission en ce qui concerne les contrôles officiels",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32019R0627",
    resume: [
      "Le règlement d'exécution (UE) 2019/627 fixe les modalités pratiques des contrôles officiels applicables aux produits d'origine animale destinés à la consommation humaine, notamment dans les établissements de production de viandes.",
      "Concernant les marques, il précise notamment les règles relatives à la marque de salubrité apposée sur les carcasses et viandes après l'inspection sanitaire. Il définit notamment sa forme, son contenu et ses conditions d'apposition.",
    ],
    motsCles: [
      "contrôles officiels",
      "inspection sanitaire",
      "marque de salubrité",
      "carcasses",
      "viandes",
      "établissement d'abattage",
    ],
  },
  {
    titre: "Règlement d'exécution (UE) 2019/1715",
    intitule:
      "Règlement d'exécution (UE) 2019/1715 de la Commission du 30 septembre 2019 établissant les règles de fonctionnement du système de gestion de l'information sur les contrôles officiels et de ses composantes",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32019R1715",
    resume: [
      "Définit les règles de fonctionnement du système d'information TRACES NT, outil numérique européen de certification et de traçabilité des mouvements d'animaux et de denrées. Précise les rôles, droits d'accès et responsabilités des différents utilisateurs (autorités, opérateurs). Encadre les échanges de données entre États membres et avec les pays tiers.",
    ],
    motsCles: [
      "TRACES NT",
      "système d'information",
      "certification",
      "échanges intracommunautaires",
    ],
  },
  {
    titre: "Règlement délégué (UE) 2020/687",
    intitule:
      "Règlement délégué (UE) 2020/687 de la Commission du 17 décembre 2019 complétant le règlement (UE) 2016/429 du Parlement européen et du Conseil en ce qui concerne les règles relatives à la prévention de certaines maladies répertoriées et à la lutte contre celles-ci",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32020R0687",
    resume: [
      "Complète le règlement 2016/429 en détaillant les mesures concrètes de prévention et de lutte applicables en cas de suspicion ou de confirmation de maladies répertoriées des catégories A, B et C. Définit les zones réglementées, les mesures de gestion des animaux et des produits, de restriction de mouvement et de nettoyage-désinfection.",
    ],
    motsCles: [
      "prévention",
      "lutte",
      "maladies répertoriées",
      "zones réglementées",
      "foyer",
      "restrictions de mouvements",
      "traitements d'atténuation",
    ],
  },
  {
    titre: "Règlement d'exécution (UE) 2020/2235",
    intitule:
      "Règlement d'exécution (UE) 2020/2235 de la Commission du 16 décembre 2020 portant modalités d'application des règlements (UE) 2016/429 et (UE) 2017/625 du Parlement européen et du Conseil en ce qui concerne les modèles de certificat zoosanitaire, les modèles de certificat officiel et les modèles de certificat zoosanitaire/officiel pour l'entrée dans l'Union et les mouvements au sein de l'Union d'envois de certaines catégories d'animaux et de biens, ainsi qu'en ce qui concerne la certification officielle relative à ces certificats",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32020R2235",
    resume: [
      "Fixe les modèles harmonisés de certificats zoosanitaires et officiels pour les mouvements d'animaux et de biens au sein et à l'entrée dans l'UE. Précise les modalités de la certification officielle, notamment les conditions de signature électronique et les délais de validité. Garantit l'uniformité des documents utilisés dans TRACES NT entre tous les États membres.",
    ],
    motsCles: [
      "certification zoosanitaire",
      "modèles de document",
      "échanges intracommunautaires",
      "TRACES",
    ],
  },
  {
    titre: "Règlement d'exécution (UE) 2023/594",
    intitule:
      "Règlement d'exécution (UE) 2023/594 de la Commission du 16 mars 2023 établissant des mesures spéciales de lutte contre la peste porcine africaine",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32023R0594",
    resume: [
      "Établit des mesures spécifiques et renforcées de lutte contre la peste porcine africaine (PPA), adaptées à l'évolution épidémiologique en Europe. Définit les mesures à appliquer en phase de régionalisation, les zones réglementées (I, II et III) et les restrictions associées aux mouvements de suidés et des produits qui en sont issus. Constitue le texte européen de référence opérationnel en contexte de crise PPA.",
    ],
    motsCles: [
      "peste porcine africaine",
      "zones réglementées",
      "lutte",
      "restrictions de mouvements",
    ],
  },
];

const ARRETES_MINISTERIELS: Texte[] = [
  {
    titre: "Arrêté du 18 décembre 2009",
    intitule:
      "Arrêté du 18 décembre 2009 relatif aux règles sanitaires applicables aux produits d'origine animale et aux denrées alimentaires en contenant",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021533994",
    resume: [
      "L'arrêté du 18 décembre 2009 précise certaines règles sanitaires nationales applicables aux produits d'origine animale et complète notamment les dispositions européennes relatives au marquage de salubrité.",
      "Concernant les marques, il définit notamment différentes marques de salubrité nationales et communautaires, leur forme, leur contenu et, pour certaines d'entre elles, les restrictions de mise sur le marché qui leur sont associées.",
    ],
    motsCles: [
      "marque de salubrité",
      "marque de salubrité avec restriction",
      "police sanitaire",
      "forme de la marque",
      "numéro d'agrément",
      "restrictions de mise sur le marché",
    ],
  },
  {
    titre: "Arrêté du 29 avril 2019",
    intitule:
      "Arrêté du 29 avril 2019 relatif aux mesures de prévention de la propagation des dangers sanitaires réglementés via le transport par véhicules routiers de suidés vivants",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000038431665",
    resume: [
      "Fixe les mesures de prévention de la propagation des dangers sanitaires, notamment la PPA, lors du transport par véhicules routiers de suidés vivants. Impose des exigences de nettoyage et de désinfection des véhicules et définit les responsabilités des transporteurs. Constitue un maillon essentiel de la biosécurité dans la chaîne de transport porcin en contexte de risque PPA.",
    ],
    motsCles: [
      "peste porcine africaine",
      "transport de suidés",
      "biosécurité",
      "nettoyage-désinfection",
    ],
  },
  {
    titre: "Arrêté du 24 avril 2024",
    intitule:
      "Arrêté du 24 avril 2024 fixant les règles générales de police sanitaire relatives aux produits d'origine animale issus d'animaux terrestres destinés à la consommation humaine",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000049467923",
    resume: [
      "Texte national consolidant les règles générales de police sanitaire applicables aux produits d'origine animale issus d'animaux terrestres destinés à la consommation humaine. Intègre les modalités de l'agrément zoosanitaire MCA et précise les modalités de contrôle et de gestion sanitaire en France. Constitue le texte de référence national en matière de police sanitaire pour les denrées alimentaires.",
    ],
    motsCles: [
      "police sanitaire",
      "agrément zoosanitaire MCA",
      "denrées alimentaires d'origine animale",
      "contrôles",
    ],
  },
];

const INSTRUCTIONS_TECHNIQUES: Texte[] = [
  {
    titre: "Instruction technique DGAL/SDSPA/2020-517",
    intitule:
      "Instruction technique DGAL/SDSPA/2020-517 du 13/08/2020 - Biosécurité au cours du transport d'oiseaux ou de suidés",
    url: "https://info.agriculture.gouv.fr/boagri/instruction-2020-517",
    resume: [
      "Décline opérationnellement les exigences de biosécurité lors du transport d'oiseaux et de suidés, en lien avec les risques d'influenza aviaire hautement pathogène (IAHP) et de PPA. Fournit aux agents et opérateurs des procédures concrètes de nettoyage, désinfection et gestion des mouvements. Complète l'arrêté du 29 avril 2019 par des modalités techniques applicables sur le terrain.",
    ],
    motsCles: [
      "biosécurité",
      "transport",
      "peste porcine africaine",
      "influenza aviaire hautement pathogène",
    ],
  },
  {
    titre: "Instruction technique DGAL/SDSSA/2022-263",
    intitule:
      "Instruction technique DGAL/SDSSA/2022-263 du 01/04/2022 - Inspections ciblées portant sur les stations de lavage des abattoirs d'animaux de boucherie en contexte PPA",
    url: "https://info.agriculture.gouv.fr/boagri/instruction-2022-263",
    resume: [
      "Organise des inspections ciblées des stations de lavage et désinfection des abattoirs d'animaux de boucherie dans le contexte du risque PPA. Définit les critères d'inspection, les non-conformités et les suites à donner en cas d'insuffisance. Vise à renforcer un maillon critique de la biosécurité en abattoir face au risque de diffusion virale.",
    ],
    motsCles: [
      "abattoir",
      "nettoyage et désinfection",
      "inspection ciblée",
      "peste porcine africaine",
      "biosécurité",
    ],
  },
  {
    titre: "Instruction technique DGAL/SDSSA/2022-276",
    intitule:
      "Instruction technique DGAL/SDSSA/2022-276 du 06/04/2022 - Enregistrement des établissements agréés de denrées alimentaires d'origine animale dans TRACES NT et validation des rôles « opérateur » des utilisateurs",
    url: "https://info.agriculture.rie.gouv.fr/gedei/site/bo-agri/instruction-2022-276",
    diffusionLimitee: true,
    resume: [
      "Détaille la procédure d'enregistrement des établissements agréés pour les denrées alimentaires d'origine animale dans le système TRACES NT. Précise les modalités de validation des rôles « opérateur » et les responsabilités des services vétérinaires départementaux. Assure la cohérence entre les agréments nationaux et les données partagées au niveau européen.",
    ],
    motsCles: ["TRACES NT", "enregistrement", "établissements agréés", "opérateur"],
  },
  {
    titre: "Instruction technique DGAL/SDSSA/2024-253",
    intitule:
      "Instruction technique DGAL/SDSSA/2024-253 du 25/04/2024 - Gestion, dans les établissements du secteur alimentaire, des denrées alimentaires d'origine animale et des sous-produits animaux en zone réglementée suite à la confirmation d'un cas de peste porcine africaine",
    url: "https://info.agriculture.gouv.fr/boagri/instruction-2024-253",
    resume: [
      "Précise les procédures de gestion des denrées alimentaires d'origine animale et des sous-produits animaux issus de suidés soumis à restriction et dans les établissements situés en zone réglementée suite à la confirmation d'un cas de PPA. Définit les conditions de valorisation des viandes de suidés selon leur statut sanitaire et les mesures de biosécurité à respecter.",
    ],
    motsCles: [
      "peste porcine africaine",
      "gestion des denrées d'origine animale",
      "crise sanitaire",
      "zones réglementées",
      "valorisation",
      "mesures de biosécurité",
    ],
  },
  {
    titre: "Instruction technique DGAL/SDSSA/2024-274",
    intitule:
      "Instruction technique DGAL/SDSSA/2024-274 du 14/05/2024 - Procédure de délivrance des agréments zoosanitaires MCA en contexte de PPA",
    url: "https://info.agriculture.gouv.fr/boagri/instruction-2024-274",
    resume: [
      "Définit la procédure de délivrance des agréments zoosanitaires maladies de catégorie A (MCA). Reprend les exigences sanitaires à respecter en contexte de crise et explicite les modalités d'instruction et de contrôle des mesures de biosécurité en établissements du secteur alimentaire.",
    ],
    motsCles: [
      "agrément zoosanitaire MCA",
      "procédure",
      "instruction de dossier",
      "biosécurité en établissements du secteur alimentaire",
    ],
  },
  {
    titre: "Instruction technique DGAL/SDSBEA/2024-466",
    intitule:
      "Instruction technique DGAL/SDSBEA/2024-466 du 08/08/2024 - Plan national d'intervention sanitaire d'urgence Peste porcine africaine – scénarios et stratégie de lutte",
    url: "https://info.agriculture.gouv.fr/boagri/instruction-2024-466",
    resume: [
      "Présente le Plan National d'Intervention Sanitaire d'Urgence dédié à la PPA, avec ses différents scénarios d'activation selon le niveau de risque et la localisation géographique des cas. Décrit la stratégie globale de lutte, les rôles de chaque acteur (DGAL, préfets, DD(ETS)PP, professionnels) et les ressources mobilisables.",
    ],
    motsCles: [
      "PNISU",
      "peste porcine africaine",
      "plan d'intervention",
      "stratégie de lutte",
      "scénarios de crise",
    ],
  },
  {
    titre: "Instruction technique DGAL/SDSBEA/2025-241",
    intitule:
      "Instruction technique DGAL/SDSBEA/2025-241 du 22/04/2025 - Gestion des comptes dans TRACES NT : création des comptes opérateurs, utilisateurs et VOP",
    url: "https://info.agriculture.rie.gouv.fr/gedei/site/bo-agri/instruction-2025-241",
    diffusionLimitee: true,
    resume: [
      "Fournit un guide pratique à destination des agents et opérateurs pour la création et la gestion des comptes utilisateurs dans le système TRACES NT. Détaille les rôles, droits d'accès et procédures d'habilitation applicables aux échanges intra-UE d'animaux et de produits germinaux. Constitue le document de référence opérationnel pour l'utilisation de TRACES NT.",
    ],
    motsCles: ["TRACES NT", "guide pratique", "habilitation", "échanges intracommunautaires"],
  },
  {
    titre: "Instruction technique DGAL/SDSBEA/2026-218",
    intitule:
      "Instruction technique DGAL/SDSBEA/2026-218 du 16/04/2026 - Gestion et surveillance des suidés en zone réglementée",
    url: "https://info.agriculture.gouv.fr/boagri/instruction-2026-218",
    resume: [
      "Décrit les mesures de gestion et de surveillance à mettre en place dans les zones réglementées suite à la confirmation de foyers ou de cas de peste porcine africaine.",
    ],
    motsCles: [
      "peste porcine africaine",
      "gestion des suidés",
      "zone réglementée",
      "foyer",
      "élevage",
    ],
  },
];

const GROUPES: Groupe[] = [
  { titre: "Règlements européens", textes: REGLEMENTS_EUROPEENS },
  { titre: "Arrêtés ministériels", textes: ARRETES_MINISTERIELS },
  { titre: "Instructions techniques", textes: INSTRUCTIONS_TECHNIQUES },
];

export function CorpusReglementairePage() {
  return (
    <FicheDocumentation
      fiche={FICHE_CORPUS}
      essentiel={
        <>
          Les règles applicables aux mouvements de viandes de porcs en contexte de peste porcine
          africaine{" "}
          <strong>reposent sur plusieurs textes européens et français qui se complètent</strong>.
        </>
      }
    >
      {GROUPES.map((groupe, index) => (
        <Accordeon key={groupe.titre} groupe={groupe} ouvert={index === 0} />
      ))}
    </FicheDocumentation>
  );
}

// Accordéons DSFR indépendants (hors fr-accordions-group, qui n'en laisserait qu'un ouvert) ;
// seul le premier est ouvert à l'arrivée (maquette). Ouverture/fermeture gérée par le JS DSFR.
function Accordeon({ groupe, ouvert }: { groupe: Groupe; ouvert: boolean }) {
  const id = useId();
  return (
    <section className="fr-accordion">
      <h2 className="fr-accordion__title">
        <button
          type="button"
          className="fr-accordion__btn"
          aria-expanded={ouvert}
          aria-controls={id}
        >
          {groupe.titre}
        </button>
      </h2>
      <div className={`fr-collapse${ouvert ? " fr-collapse--expanded" : ""}`} id={id}>
        {groupe.textes.map((texte, index) => (
          <article key={texte.url}>
            {index > 0 && <hr />}
            <h3 className="fr-h6">{texte.titre}</h3>
            <p>
              <a href={texte.url} target="_blank" rel="noopener noreferrer">
                {texte.intitule}
              </a>
              {texte.diffusionLimitee && (
                <>
                  {" "}
                  <span className="fr-badge fr-badge--sm fr-badge--info fr-badge--no-icon">
                    Accès réservé aux agents
                  </span>
                </>
              )}
            </p>
            {texte.resume.map((paragraphe) => (
              <p key={paragraphe}>{paragraphe}</p>
            ))}
            <p>
              <strong>Mots-clés</strong> : {texte.motsCles.join(" · ")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
