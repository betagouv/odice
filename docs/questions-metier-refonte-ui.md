# Refonte UI des simulateurs — Questions à valider avec l'équipe métier

> Document de travail : points à **confirmer, infirmer ou compléter** par l'équipe métier, relevés pendant la refonte UI (branche `feat/refonte-ui-simulateurs`, v0.16.0).
> Pour chaque point : le **choix appliqué par défaut** dans l'application, la **question** posée et l'**impact** d'une réponse différente.
> Cocher la réponse et compléter la colonne « Décision » ; l'équipe technique mettra à jour le code et ce document.

Légende des priorités : **P1** change un résultat réglementaire affiché · **P2** change un libellé ou un texte réglementaire · **P3** présentation ou mesure d'audience.

---

## 1. Autres établissements — valeurs déduites des questions de traitement

La spec « Retirer les situations impossibles » supprime ou restreint les questions de traitement et donne leurs valeurs connues (règles M1 à M6). L'analyse des 32 928 cas de l'oracle montre que, dans **trois situations**, la spec masque une question qui **influence le résultat** sans en donner la valeur. Des hypothèses ont été appliquées (cf. [ADR-0016](./adr/0016-autres-etablissements-valeurs-deduites.md), tableau complet dans [`simulateur-etablissements.md`](./simulateur-etablissements.md)).

| # | Prio | Situation | Choix appliqué | Question | Décision |
|---|---|---|---|---|---|
| Q1 | P1 | Porcs en **ZP ou ZS**, marque **ovale** ou **diagonales parallèles** | Traitement obligatoire national = **OUI** (par analogie avec M4), donc UE = OUI ; traitement réalisé = OUI (M2) | Le traitement national est-il bien obligatoire dans ce cas ? | ☐ Confirmé ☐ Infirmé : … |
| Q2 | P1 | Porcs en **ZI FS, ZRII ou ZRIII**, marque **ovale** | Traitement national = **NON**, traitement réalisé = **NON** | Ces valeurs sont-elles correctes, ou faut-il poser les questions à l'utilisateur dans ce cas ? | ☐ Confirmé ☐ Poser les questions ☐ Autre : … |
| Q3 | P1 | Porcs en **ZRIII**, marque **diagonales**, traitement national déclaré **NON** | Question « réalisé » non posée, valeur **NON** | Confirmer que le traitement n'est pas réalisé dans ce cas (ou faut-il poser la question) ? | ☐ Confirmé ☐ Poser la question ☐ Autre : … |

> **Éclairage (page « Niveau de risque », 2026-10-08)** : le tableau des viandes ne montre aucun traitement national pour ZS / ZP avec une ovale (niveaux 6 et 7). Pour **Q1**, sur l'oracle, l'hypothèse « national = OUI » ne change le résultat dans aucun des 392 cas concernés (ovale, traitement réalisé), et la marque ovale diagonales ne peut pas exister en ZS / ZP ; l'hypothèse reste donc sans effet sur les résultats, mais le formulaire propose encore cette marque dans ces zones.

Code : [`traitementRegles.ts`](../src/features/simulateurs/etablissements/components/traitementRegles.ts) (`deduireTraitements`).

## 2. Autres établissements — situations impossibles

| # | Prio | Sujet | Choix appliqué | Question | Décision |
|---|---|---|---|---|---|
| Q4 | P2 | Message « Situation impossible : vérifier qu'il n'y ait pas de mélange de lot. Se référer à l'**espace documentaire** pour identifier la zone à renseigner. » | Texte seul, sans lien | Quel est « l'espace documentaire » visé ? Faut-il un lien (page « Niveau de risque des porcs et des viandes », documentation réglementaire, autre) ? | ☐ Lien vers : … ☐ Pas de lien |
| Q5 | P3 | ZI FS réflexe comme **zone de l'établissement** ou **du destinataire** (les deux simulateurs) | Autorisée, traitée comme ZI FS ; seule la **zone d'origine des porcs** est bloquée (Autres établissements et, depuis 2026-10-08, Abattoirs) | Le blocage ne concerne-t-il bien que la zone d'origine des porcs ? | ☐ Confirmé ☐ Bloquer aussi : … |

## 3. Panneau de résultats — libellés absents de la nomenclature

La nomenclature des badges ne couvre pas toutes les valeurs du moteur. Libellés proposés (cf. [ADR-0015](./adr/0015-panneau-resultats-commun-et-masquage.md)) :

| # | Prio | Valeur du moteur | Libellé affiché | Question | Décision |
|---|---|---|---|---|---|
| Q6 | P2 | Document France : LPS non requis (≈ 80 % des cas autorisés) | « LAISSEZ-PASSER SANITAIRE NON REQUIS » | Libellé correct ? Ou faut-il masquer la ligne ? | ☐ Confirmé ☐ Masquer ☐ Autre : … |
| Q7 | P2 | Document UE : dérogation possible | « DÉROGATION AU CERTIFICAT ZOOSANITAIRE POSSIBLE » | Libellé correct ? | ☐ Confirmé ☐ Autre : … |
| Q8 | P2 | Document UE : certification non requise | « CERTIFICAT ZOOSANITAIRE NON REQUIS » | Libellé correct ? | ☐ Confirmé ☐ Autre : … |

## 4. Bandeau « Mentions à reporter sur les documents commerciaux »

| # | Prio | Sujet | Choix appliqué | Question | Décision |
|---|---|---|---|---|---|
| Q9 | P1 | Ligne traitement quand le traitement France est **non obligatoire** et l'UE **autorisée** ou **interdite** (hors ovale barrée) — cas les plus fréquents | **Aucune ligne traitement** (la spec ne couvre que « France vide ») ; le bandeau ne contient alors que la zone (et le statut pour Abattoirs) | Est-ce l'intention ? Ou faut-il une mention (ex. « Traitement d'atténuation non obligatoire ») ? | ☐ Confirmé ☐ Ajouter : … |
| Q10 | P2 | Titre : la spec écrit « sur **les** documents commerciaux » (message de base) et « sur **vos** documents commerciaux » (exemple) | « …sur **les** documents commerciaux : » | Quelle formulation ? | ☐ les ☐ vos |
| Q11 | P3 | Style : la spec montre un ⚠ et une barre latérale | Alerte DSFR **bleue « info »** (le « bandeau bleu ») | Garder le bleu, ou passer à l'alerte orange « avertissement » ? | ☐ Bleu ☐ Orange |
| Q13 | P3 | Encart « Ne pas oublier » et son lien vers la documentation réglementaire | **Supprimés** (remplacés par le bandeau, comme sur la maquette) | Un lien vers la documentation réglementaire doit-il subsister dans les résultats ? | ☐ Non ☐ Oui, où : … |

## 5. Page « Niveau de risque des porcs et des viandes »

| # | Prio | Sujet | Choix appliqué | Question | Décision |
|---|---|---|---|---|---|
| Q14 | **P1** | Tableau « Autres industries » : la maquette ne renseigne la **marque sanitaire** qu'au niveau 16 (ovale barrée) | Marques **déduites** de la structure du tableau : les 17 niveaux sont exactement les 15 combinaisons zone × marque possibles (ni diagonales en ZS / ZP, ni marque spéciale en zone saine) + 2 variantes avec traitement national en ZRIII. Niveaux 1 à 7 : ovale ; 8, 10, 12, 14 : ovale diagonales parallèles ; 9, 11, 13, 15, 16, 17 : ovale barrée | Valider ces marques, en particulier l'**ordre dans chaque paire** (diagonales avant barrée : niveaux 8-9, 10-11, 12-13, 14-15) et la présence d'une seule ligne ovale pour ZS et ZP | ☐ Confirmé ☐ Corrections : … |
| Q15 | P2 | Tableau Abattoir, niveau 4 : la maquette indique « Zone réglementée **II** (ZRIII) » | Affiché « Zone réglementée **III** (ZRIII) » | Confirmer qu'il s'agit bien de la ZRIII | ☐ Confirmé |
| Q16 | P2 | Ordonnancement des deux tableaux (niveaux 1 à 9 et 1 à 17) | Repris de la maquette | Valider l'ordre et le contenu réglementaire | ☐ Validé ☐ Corrections : … |
| Q17 | P3 | Accès à la page | Lien « référez-vous à ce tableau » (nouvel onglet) et plan du site ; **pas** dans le menu principal | Faut-il l'ajouter au menu principal ou à la documentation réglementaire ? | ☐ Non ☐ Menu ☐ Documentation |

## 6. Textes et infobulles

| # | Prio | Sujet | Choix appliqué | Question | Décision |
|---|---|---|---|---|---|
| Q18 | P2 | Infobulle du statut (MR-PPA / MNR-PPA) | La phrase « Des règles particulières s'appliquent alors à sa destination et au devenir des produits. » a été **retirée** (dernière capture fournie) | Retrait volontaire ? | ☐ Confirmé ☐ Rétablir |
| Q19 | P2 | Texte de périmètre de « 2. Destination des viandes » (Autres établissements) | « …les produits contenant des viandes **de porc**. » (aligné sur la section 1) | Confirmer « de porc » pour la destination aussi | ☐ Confirmé ☐ Retirer |
| Q20 | P3 | Guillemets dans les infobulles et libellés (« Maladie de Catégorie A », « porcs ») | Guillemets français « » (la maquette utilise des guillemets droits) | Garder les guillemets français ? | ☐ Oui ☐ Guillemets droits |
| Q21 | P3 | Alignement du texte des infobulles | Aligné à gauche (standard DSFR) ; la maquette le centre | Garder l'alignement à gauche ? | ☐ Oui ☐ Centrer |

## 7. Mesure d'audience (Matomo)

| # | Prio | Sujet | Choix appliqué | Question | Décision |
|---|---|---|---|---|---|
| Q22 | P3 | ZI FS réflexe | Non distinguée de ZI FS dans Matomo (dimension `zone_suides`, signature des combinaisons) | Faut-il suivre séparément les simulations en ZI FS réflexe ? | ☐ Non ☐ Oui |
| Q23 | P3 | Questions de traitement masquées (Autres établissements) | La signature des combinaisons reçoit les **valeurs déduites**, pas des réponses saisies | Acceptable pour l'analyse des combinaisons ? | ☐ Oui ☐ Marquer les valeurs déduites |
| Q24 | P3 | Clic sur « référez-vous à ce tableau » | Non mesuré | Faut-il mesurer ce clic ? | ☐ Non ☐ Oui |

## 8. Périmètre à planifier

| # | Sujet | État |
|---|---|---|
| Q25 | Bouton « Exporter la simulation » | **Implémenté** (PDF, cf. [ADR-0017](./adr/0017-export-pdf-react-pdf.md)). À valider : le PDF ne reprend ni le bandeau « Mentions à reporter » (absent de la maquette), ni les réponses de traitement d'Autres établissements (souvent déduites). Faut-il les ajouter ? |
| Q26 | Page « Aide à l'utilisation » | Retirée de cette version ; à réintroduire une fois les maquettes stabilisées ? |
| Q27 | Page « Documentation réglementaire » | Toujours « contenu en cours de rédaction » : contenu à fournir |

---

## Décisions déjà validées pendant la refonte (pour mémoire)

- ZI FS réflexe : même conditionnalité que ZI FS dans les deux simulateurs, sauf comme zone d'origine des porcs, où elle est bloquée (alerte rouge, validation impossible) dans Autres établissements et dans Abattoirs (validé 2026-10-08).
- Affichage progressif **partie par partie** ; statut uniquement en ZRII / ZRIII.
- Masquage des sorties : FR interdit → seule la possibilité de mouvement ; UE interdit → pas de lignes UE.
- UE « interdit sans traitement d'atténuation » si la marque est une ovale barrée.
- Bandeau des mentions : une zone d'origine « ZI FS réflexe » (Abattoir) s'affiche « Zone infectée faune sauvage réflexe » (validé 2026-10-08).
- Wording : « Informations » au pluriel, format « ZI FS réflexe — Zone infectée faune sauvage réflexe », libellés propres à Autres établissements (« Provenance de la matière première »).
- Nom du produit : « Odicé » ; page d'aide retirée de cette version.

## Liens

- ADR : [0013](./adr/0013-refonte-ui-simulateurs-et-retrait-aide.md), [0014](./adr/0014-affichage-progressif-par-section.md), [0015](./adr/0015-panneau-resultats-commun-et-masquage.md), [0016](./adr/0016-autres-etablissements-valeurs-deduites.md), [0017](./adr/0017-export-pdf-react-pdf.md)
- Points à valider antérieurs (moteur Abattoirs) : [`simulateur-abattoirs-points-a-valider.md`](./simulateur-abattoirs-points-a-valider.md)
