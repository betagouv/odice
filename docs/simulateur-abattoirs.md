# Simulateur Abattoirs — Documentation métier

> Documentation de référence pour les règles métier du simulateur Abattoirs d'ODICE.
> Toutes les règles décrites ci-dessous ont été vérifiées sur les 2 744 combinaisons
> du fichier `20260512_Test_formules.xlsx` (couverture 100 %).

## 1. Périmètre

Le simulateur Abattoirs s'adresse aux professionnels d'abattoirs porcins en contexte de PPA (Peste Porcine Africaine). À partir de 6 informations sur la situation (zone des suidés à la réception, situation de l'abattoir, situation de l'établissement destinataire), il indique :

- la **marque sanitaire** à apposer sur les viandes ;
- la **possibilité de mouvement** vers le marché national et vers l'UE ;
- l'éventuel **traitement d'atténuation** (TA) requis ;
- le **document d'accompagnement** national (LPS) et UE (certification zoosanitaire).

**Hors périmètre** : suidés sauvages, autres établissements (objet d'un second simulateur).

## 2. Glossaire

| Terme | Signification |
|---|---|
| **PPA** | Peste Porcine Africaine — maladie animale réglementée |
| **MCA** | Maîtrise Conditionnelle Approuvée — agrément zoosanitaire d'un établissement permettant des dérogations aux restrictions de mouvement |
| **LPS** | Laissez-Passer Sanitaire — document d'accompagnement national |
| **LPS permanent** | LPS valable plusieurs mouvements (établissement autorisé) |
| **LPS systématique** | LPS à émettre pour chaque mouvement |
| **TA** | Traitement d'Atténuation — traitement thermique (cuisson) inactivant le virus de la PPA |
| **MR-PPA** | Mouvement Réglementé PPA — statut animal sain provenant d'un élevage non suspecté |
| **MNR-PPA** | Mouvement Non Réglementé PPA — statut animal suspecté ou issu d'élevage suspecté |
| **Zone indemne** | Territoire sans aucune restriction PPA |
| **ZP** | Zone de Protection (foyer animaux domestiques) |
| **ZS** | Zone de Surveillance (autour de ZP) |
| **ZI FS** | Zone Infectée Faune Sauvage |
| **ZRI** | Zone Réglementée I (faible niveau de restriction, UE) |
| **ZRII** | Zone Réglementée II (niveau intermédiaire, UE) |
| **ZRIII** | Zone Réglementée III (niveau le plus élevé, UE) |
| **Marque ovale** | Marque sanitaire standard — mouvement national + UE autorisés |
| **Marque ovale barrée** | Marque sanitaire restreinte — mouvement national uniquement |
| **Marque ovale diagonales parallèles** | Marque très restreinte — mouvement national uniquement, traçabilité renforcée |

## 3. Inputs

Le simulateur prend **6 champs en entrée**.

### 3.1 Liste des champs

| Variable technique | Libellé utilisateur | Type | Valeurs |
|---|---|---|---|
| `zoneSuides` | Zone d'origine des suidés dont sont issues les viandes | enum | `zone indemne`, `ZP`, `ZS`, `ZI FS`, `ZRI`, `ZRII`, `ZRIII` |
| `statut` | Statut réglementaire du mouvement des animaux | enum | `MR-PPA`, `MNR-PPA` |
| `zoneAbattoir` | Zone dans laquelle est localisé votre abattoir | enum | (mêmes 7 valeurs) |
| `mcaAbattoir` | Votre abattoir est-il en possession d'un agrément zoosanitaire MCA ? | booléen | `OUI`, `NON` |
| `zoneEtbDestinataire` | Zone dans laquelle est localisé l'établissement destinataire des viandes | enum | (mêmes 7 valeurs) |
| `mcaEtbDestinataire` | L'établissement destinataire est-il en possession d'un agrément zoosanitaire MCA ? | booléen | `OUI`, `NON` |

### 3.2 Conditions d'affichage UI

| Champ | Affiché si |
|---|---|
| `zoneSuides` | Toujours |
| `statut` | `zoneSuides ∈ { ZRII, ZRIII }` (n'a aucun impact réglementaire pour les 5 autres zones — vérifié sur 2 744 cas) |
| `zoneAbattoir` | Toujours |
| `mcaAbattoir` | Toujours |
| `zoneEtbDestinataire` | Toujours |
| `mcaEtbDestinataire` | Toujours |

> **Note** — Au niveau du moteur, `statut` est accepté en input même quand il n'est pas applicable ; il est alors silencieusement ignoré.

### 3.3 Validation des combinaisons

Aucune validation de cohérence inter-champs n'est effectuée. Toute combinaison des 2 744 possibilités est acceptée et évaluée conformément au test xlsx.
*(point à reconfirmer avec l'équipe métier — cf. [points-a-valider TODO 5](./simulateur-abattoirs-points-a-valider.md))*

## 4. Outputs

Le simulateur retourne **7 champs en sortie**.

| Variable technique | Libellé utilisateur | Valeurs possibles |
|---|---|---|
| `marque` | Marque à apposer sur les viandes | `ovale`, `ovale barrée`, `ovale diagonales parallèles`, `null` (interdiction) |
| `frMouvement` | Possibilité de mouvement — France | `autorisé`, `interdit` |
| `ueMouvement` | Possibilité de mouvement — UE | `autorisé`, `interdit` |
| `frTraitement` | Traitement d'atténuation — France | `obligatoire`, `non obligatoire`, `null` (si mouvement interdit) |
| `ueTraitement` | Traitement d'atténuation — UE | `obligatoire`, `non obligatoire`, `null` |
| `frDocument` | Document d'accompagnement — France | `LPS permanent`, `LPS systématique`, `LPS non requis`, `null` |
| `ueDocument` | Document d'accompagnement — UE | `Certification zoosanitaire obligatoire`, `Dérogation à la certification zoosanitaire possible`, `Certification zoosanitaire non requise`, `null` |

> **Note libellés** — La valeur `Dérogation à la certification zoosanitaire possible` est utilisée à la place de la valeur historique `… obligatoire` du test xlsx (décision validée, à confirmer définitivement avec l'équipe métier — cf. [TODO 4](./simulateur-abattoirs-points-a-valider.md)).

## 5. Tableaux de décision

> Convention : « — » signifie que le critère n'a pas d'impact sur cette ligne.
> Lecture : on prend la **première ligne dont tous les critères correspondent à la situation**.

### 5.1 `marque`

| # | zoneSuides | statut | mcaAbattoir | mcaEtbDest | zoneEtbDest | → marque |
|---|---|---|---|---|---|---|
| 1 | zone indemne | — | — | — | — | **ovale** |
| 2 | ZRI | — | — | — | — | **ovale** |
| 3 | ZRII | MR-PPA | OUI | OUI | — | **ovale** |
| 4 | ZRII | MR-PPA | OUI | NON | zone indemne, ZRI | **ovale** |
| 5 | ZP, ZS, ZI FS | — | OUI | OUI | — | **ovale barrée** |
| 6 | ZRII, ZRIII | MNR-PPA | OUI | OUI | — | **ovale barrée** |
| 7 | ZRIII | MR-PPA | OUI | OUI | — | **ovale barrée** |
| 8 | ZI FS | — | OUI | NON | — | **ovale diagonales parallèles** |
| 9 | ZRII, ZRIII | MNR-PPA | OUI | NON | — | **ovale diagonales parallèles** |
| 10 | ZRIII | MR-PPA | OUI | NON | — | **ovale diagonales parallèles** |
| 11 | ZRII | MR-PPA | OUI | NON | ZP, ZS, ZI FS, ZRII, ZRIII | **ovale diagonales parallèles** |
| 12 | (tout autre cas) | | | | | **`null` (interdiction de mouvement)** |

**Répartition sur les 2 744 cas** : ovale 847 / ovale barrée 441 / ovale diagonales parallèles 280 / interdiction 1 176.

### 5.2 `frMouvement` (France)

| # | marque | → frMouvement |
|---|---|---|
| 1 | ovale, ovale barrée, ovale diagonales parallèles | **autorisé** |
| 2 | `null` | **interdit** |

### 5.3 `ueMouvement` (UE)

| # | marque | → ueMouvement |
|---|---|---|
| 1 | ovale | **autorisé** |
| 2 | ovale barrée, ovale diagonales parallèles, `null` | **interdit** |

### 5.4 `frTraitement` (France)

| # | zoneSuides | statut | mcaAbattoir | marque | → frTraitement |
|---|---|---|---|---|---|
| 1 | ZP, ZS | — | — | ovale barrée | **obligatoire** |
| 2 | ZRIII | MNR-PPA | OUI | — | **obligatoire** |
| 3 | zone indemne, ZRI | — | — | (présente) | **non obligatoire** |
| 4 | ZI FS, ZRII | — | OUI | (présente) | **non obligatoire** |
| 5 | ZRIII | MR-PPA | OUI | (présente) | **non obligatoire** |
| 6 | (marque absente, mouvement interdit) | | | `null` | **`null`** |

### 5.5 `ueTraitement` (UE)

| # | zoneSuides | marque | → ueTraitement |
|---|---|---|---|
| 1 | — | ovale barrée | **obligatoire** (informationnel : autorise l'UE si TA réalisé) |
| 2 | zone indemne, ZRI | (présente) | **non obligatoire** |
| 3 | ZRII | ovale | **non obligatoire** |
| 4 | (autres cas, mouvement UE interdit) | | **`null`** |

> **Sémantique « obligatoire » quand mouvement UE interdit** : la valeur « obligatoire » est retournée même quand `ueMouvement = interdit` (cas marque ovale barrée). Sémantique conservée selon le test xlsx — interprétation : « pour autoriser un mouvement UE, un traitement d'atténuation serait obligatoire ».

### 5.6 `frDocument` (LPS — France)

| # | zoneSuides | statut | mcaAbattoir | mcaEtbDest | zoneEtbDest | marque | → frDocument |
|---|---|---|---|---|---|---|---|
| 1 | — | — | OUI | OUI | — | ovale barrée | **LPS permanent** |
| 2 | ZRIII | MNR-PPA | OUI | NON | — | — | **LPS systématique** |
| 3 | — | — | — | — | — | ovale | **LPS non requis** |
| 4 | ZI FS | — | OUI | NON | — | — | **LPS non requis** |
| 5 | ZRII | MNR-PPA | OUI | NON | — | — | **LPS non requis** |
| 6 | ZRIII | MR-PPA | OUI | NON | — | — | **LPS non requis** |
| 7 | ZRII | MR-PPA | OUI | NON | zone indemne, ZRI | — | **LPS non requis** |
| 8 | (autres cas avec mouvement interdit) | | | | | `null` | **`null`** |

> **Trou identifié** : 35 cas (ZRII MR-PPA + MCA abattoir OUI + MCA dest NON + zone dest ∈ {ZP, ZS, ZI FS, ZRII, ZRIII}) produisent `marque = ovale diagonales parallèles` mais `frDocument = null` selon le test xlsx. Voir [TODO 1](./simulateur-abattoirs-points-a-valider.md). En attendant validation métier, le moteur reproduit fidèlement le test (retour `null`).

### 5.7 `ueDocument` (Certification zoosanitaire — UE)

| # | zoneSuides | statut | mcaAbattoir | zoneAbattoir | marque | → ueDocument |
|---|---|---|---|---|---|---|
| 1 | — | — | — | ZP, ZS, ZI FS | ovale | **Certification zoosanitaire obligatoire** |
| 2 | zone indemne, ZRI | — | OUI | ZRI, ZRII, ZRIII | ovale | **Dérogation à la certification zoosanitaire possible** |
| 3 | zone indemne, ZRI | — | — | zone indemne | ovale | **Certification zoosanitaire non requise** |
| 4 | ZRII | MR-PPA | OUI | zone indemne | ovale | **Certification zoosanitaire non requise** |
| 5 | (autres cas) | | | | | **`null`** |

> **Trou identifié** : 195 cas (zoneSuides ∈ {zone indemne, ZRI} + mcaAbattoir NON + zoneAbattoir ∈ {ZRI, ZRII, ZRIII}) ont `ueMouvement = autorisé` mais `ueDocument = null`. Le formule Grist historique retournait « Dérogation à la certification possible ». Voir [TODO 2](./simulateur-abattoirs-points-a-valider.md). En attendant validation, le moteur reproduit fidèlement le test (retour `null`).
>
> **Contradiction MCA Grist vs DOCX (ligne 2 du tableau)** : voir [TODO 3](./simulateur-abattoirs-points-a-valider.md).

## 6. Cas particuliers et règles transverses

### 6.1 Interdiction totale de mouvement
Quand `marque = null`, alors `frMouvement = interdit`, `ueMouvement = interdit`, `frTraitement = null`, `ueTraitement = null`, `frDocument = null`, `ueDocument = null`.

Cas typiques d'interdiction :
- Abattoir **non agréé MCA** quand suidés viennent de ZP, ZS, ZI FS, ZRII ou ZRIII.
- Abattoir agréé MCA mais destinataire **non agréé MCA** quand suidés viennent de ZP ou ZS (toutes destinations).

### 6.2 Marque ovale = seule marque autorisant l'UE
Les marques « ovale barrée » et « ovale diagonales parallèles » réservent strictement les viandes au marché national français.

### 6.3 Le statut MR-PPA / MNR-PPA n'influence que ZRII et ZRIII
Pour `zoneSuides ∈ {zone indemne, ZP, ZS, ZI FS, ZRI}`, les sorties sont identiques que `statut = MR-PPA` ou `MNR-PPA` (vérifié sur la totalité du test xlsx).

### 6.4 Le `mcaAbattoir = NON` est très restrictif
Si l'abattoir n'est pas agréé MCA, dès lors que les suidés viennent d'une zone réglementée autre que ZRI (donc ZP, ZS, ZI FS, ZRII, ZRIII), aucun mouvement n'est autorisé.

## 7. Sources et traçabilité

| Document | Rôle |
|---|---|
| `20260512_Test_formules.xlsx` (sheet `ABATTOIRS`) | **Oracle des tests** — 2 744 combinaisons, couverture 100 % |
| `20260512_Formules.docx` | **Spécification des formules** — formules Excel sources |
| `20260520_Entrées_sorties.xlsx` | Référentiel des enums (entrées et sorties) |
| `20250812_Logigramme.pdf` | Référence conceptuelle historique |
| `20250910_Formules_Grist.pdf` | Formules Python du formulaire Grist remplacé |
| [`docs/simulateur-abattoirs-points-a-valider.md`](./simulateur-abattoirs-points-a-valider.md) | Points ouverts à valider avec l'équipe Odice |
