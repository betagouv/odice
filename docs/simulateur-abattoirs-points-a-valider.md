# Simulateur Abattoirs — Points à valider avec l'équipe Odice

> Document de travail pour synchroniser l'équipe technique et l'équipe métier
> sur les zones d'ambiguïté identifiées dans les sources de référence.

## Contexte

L'équipe technique a analysé les 5 documents de référence fournis :

| Document | Date | Rôle |
|---|---|---|
| `20250812_Logigramme.pdf` | 2025-08-12 | Arbres de décision conceptuels |
| `20250910_Formules_Grist.pdf` | 2025-09-10 | Formules Python du formulaire Grist existant |
| `20260512_Formules.docx` | 2026-05-12 | Formules Excel (nouvelle version) |
| `20260512_Test_formules.xlsx` | 2026-05-12 | Combinatoire complète : 2 744 cas |
| `20260520_Entrées_sorties.xlsx` | 2026-05-20 | Référentiel des valeurs d'entrée et de sortie |

**Choix de source de vérité (validé)** :
- Le **test xlsx (2026-05-12)** est l'oracle des tests automatisés (2 744 cas, toutes combinaisons uniques vérifiées).
- Le **DOCX (2026-05-12)** sert de spécification des formules.
- Le Grist (2025-09) et les logigrammes (2025-08) sont conservés à titre historique mais ne font plus foi en cas de divergence.

**Modèle de sortie (validé)** : 7 sorties, FR et UE séparés.

| Sortie | Valeurs possibles |
|---|---|
| `marque` | Ovale / Ovale barrée / Ovale diagonales parallèles |
| `FR_mouvement` | Autorisé / Interdit |
| `UE_mouvement` | Autorisé / Interdit |
| `FR_traitement` | Obligatoire / Non obligatoire |
| `UE_traitement` | Obligatoire / Non obligatoire |
| `FR_document` | LPS permanent / LPS systématique / LPS non requis |
| `UE_document` | Certification zoosanitaire obligatoire / Dérogation à la certification zoosanitaire possible / Certification zoosanitaire non requise |

---

## Points à valider

Chaque point ci-dessous est une décision à prendre avec l'équipe métier avant qu'elle soit gravée dans le moteur de règles.

### TODO 1 — Trous dans la formule LPS (35 cas)

**Statut** : ✅ résolu par le correctif du 2026-06-05

**Le problème en clair**
La formule actuelle du test xlsx renvoie une **valeur vide** pour le « document d'accompagnement France » (LPS) dans 35 situations très précises où, paradoxalement, le mouvement national est autorisé.

**Les 35 situations concernées**
Toutes ont en commun :
- Zone d'origine des suidés = **ZRII**
- Statut = **MR-PPA**
- Abattoir **agréé MCA**
- Établissement destinataire **non agréé MCA**
- Zone du destinataire ∈ { ZP, ZS, ZI FS, ZRII, ZRIII } (zone réglementée, hors zone indemne et ZRI)

Dans ce cas :
- Marque = « ovale diagonales parallèles » → mouvement national autorisé
- LPS (FR) = **vide**

**Pourquoi c'est gênant**
Si on autorise un mouvement national, il faut bien préciser quel document d'accompagnement utiliser. L'énumération des sorties contient pourtant la valeur « LPS non requis » qui pourrait s'appliquer ici.

**Hypothèses possibles**
1. Oubli dans la formule → corriger en « **LPS non requis** » (cohérent avec l'enum)
2. Oubli dans la formule → corriger en « **LPS permanent** » (par analogie avec ovale barrée + MCA)
3. Comportement intentionnel → afficher « non applicable » / aucun document

**Recommandation technique** : option 1 (LPS non requis), à confirmer.

---

### TODO 2 — Trous dans la formule Certification UE (195 cas)

**Statut** : ✅ résolu par le correctif du 2026-06-05

**Le problème en clair**
La formule actuelle du test xlsx renvoie une **valeur vide** pour le « document d'accompagnement UE » (certification zoosanitaire) dans 195 situations où le mouvement vers l'UE est pourtant autorisé.

**Les 195 situations concernées**
Profil dominant :
- Zone d'origine des suidés = **zone indemne** ou **ZRI**
- Statut indifférent
- Abattoir **non agréé MCA**
- Zone de l'abattoir ∈ { ZRI, ZRII, ZRIII }
- (Toutes destinations)

Dans ce cas :
- Marque = « ovale » → mouvement UE autorisé
- Certification (UE) = **vide**

**Pourquoi c'est gênant**
Pour expédier en UE, il faut soit une certification, soit une dérogation, soit une mention « non requise ». L'absence totale de valeur va laisser l'utilisateur sans réponse claire.

**Comparaison historique**
L'ancienne formule Grist (2025-09) traitait ces cas comme « **Dérogation à la certification zoosanitaire** » (avec mention « sauf si abattoir présent sur la liste des établissements autorisés à déroger »). La nouvelle formule DOCX n'a pas conservé cette branche.

**Hypothèses possibles**
1. Oubli dans la formule → corriger en « **Dérogation à la certification zoosanitaire possible** » (cohérent avec l'ancien comportement Grist)
2. Changement réglementaire intentionnel → afficher « non applicable » / aucun document
3. Autre règle métier à clarifier

**Recommandation technique** : option 1 (Dérogation possible), à confirmer.

---

### TODO 3 — Contradiction sur la condition d'agrément MCA pour la dérogation

**Statut** : ✅ résolu par le correctif du 2026-06-05 (en lien avec TODO 2)

**Le problème en clair**
Pour la « dérogation à la certification zoosanitaire » dans le cas où les suidés viennent de zone indemne ou ZRI et que l'abattoir est en ZRI/ZRII/ZRIII, les deux sources disent l'inverse l'une de l'autre sur l'agrément MCA :

| Source | Condition sur l'abattoir |
|---|---|
| Formule Grist (2025-09) | abattoir **non** agréé MCA |
| Formule DOCX (2026-05) | abattoir **agréé** MCA |

Et le cas « ZRII MR-PPA + MCA OUI + abattoir en ZRI/ZRII/ZRIII », présent dans le Grist comme cas de dérogation, est **totalement absent** du DOCX.

**Question**
Quelle est la règle actuellement en vigueur ? L'inversion de la condition MCA est suspecte (typo ou refonte ?). Comme on a fixé la « source de vérité » sur le DOCX/test xlsx, on suit le DOCX par défaut, mais ce point mérite un contrôle humain.

---

### TODO 4 — Libellé exact « Dérogation à la certification zoosanitaire »

**Statut** : ✅ résolu par le correctif du 2026-06-05 (décision provisoire prise)

**Le problème en clair**
Deux variantes du libellé existent dans les sources :

| Source | Libellé |
|---|---|
| `20260512_Test_formules.xlsx` | « Dérogation à la certification zoosanitaire **obligatoire** » |
| `20260520_Entrées_sorties.xlsx` | « Dérogation à la certification zoosanitaire **possible** » |

**Décision provisoire** : on utilise « **possible** » dans l'application (plus clair pour l'utilisateur).
Le test xlsx sera mappé en interne lors des tests automatisés pour rester cohérent.

À confirmer définitivement par l'équipe métier.

---

### TODO 5 — Combinaisons d'entrées « impossibles » dans la réalité

**Statut** : à valider (recommandation prise, non bloqué par le correctif du 2026-06-05)

**Le problème en clair**
Le test xlsx contient les 2 744 combinaisons cartésiennes possibles, y compris certaines qui pourraient sembler impossibles en pratique. Exemples :
- Suidés provenant de **ZP** mais abattoir en **zone indemne** (l'animal a-t-il vraiment été déplacé hors ZP ?)
- Statut MR-PPA pour une zone où ce statut ne s'applique pas (zone indemne, ZP, ZS, ZI FS, ZRI)

**Vérification factuelle**
Pour les 5 zones où le statut n'a pas de sens réglementaire (zone indemne, ZP, ZS, ZI FS, ZRI), il a été vérifié que MR-PPA et MNR-PPA produisent **strictement les mêmes sorties** dans les 2 744 lignes du test. Le statut n'a un impact que pour ZRII et ZRIII.

**Décision provisoire** : aucune validation de cohérence inter-champs n'est ajoutée. Le moteur évalue toute combinaison conformément au test xlsx ; l'UI peut éventuellement masquer le champ statut quand la zone ∉ { ZRII, ZRIII } (décision UI séparée).

À confirmer par l'équipe métier : faut-il interdire certaines combinaisons en amont (validation Zod) ou laisser passer ?

---

## Synthèse pour la réunion

| TODO | Sujet | Décision provisoire |
|---|---|---|
| 1 | 35 cas FR_document vide pour ZRII MR-PPA + ovale diagonales | ✅ LPS non requis (correctif du 2026-06-05) |
| 2 | 195 cas UE_document vide pour zone indemne/ZRI + non MCA + abattoir ZRI/ZRII/ZRIII | ✅ Dérogation à la certification possible (correctif du 2026-06-05) |
| 3 | Condition MCA inversée DOCX vs Grist pour la dérogation | ✅ Dérogation possible (correctif du 2026-06-05) |
| 4 | Libellé « Dérogation … obligatoire » vs « … possible » | ✅ « possible » (correctif du 2026-06-05) |
| 5 | Validation de combinaisons d'entrées impossibles | Ouvert, non bloquant (pas de validation côté moteur, UI masque le statut quand non applicable) |
