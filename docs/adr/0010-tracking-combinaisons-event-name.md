# ADR-0010 : Tracking des combinaisons de réponses via l'Event Name Matomo

**Date** : 2026-07-03
**Statut** : Accepté

## Contexte

L'équipe produit veut mesurer **quelles combinaisons de réponses** (enchaînement des choix aux 6 questions Abattoirs / 9 questions Autres établissements) sont les plus fréquemment soumises, afin d'en déduire la **polarisation des besoins utilisateurs** (quelques situations dominent-elles, ou l'usage est-il dispersé ?).

Le tracking Matomo existant ([ADR-0008](./0008-analytics-matomo-wrapper-maison.md)) émet déjà des events de parcours (`*_simulateur_ouvert`, `*_simulation_lancee`, `*_resultat_affiche`, `*_reinitialisation`) et supporte un `name` d'event ainsi que des custom dimensions. Il faut choisir **comment encoder une combinaison** pour qu'elle soit exploitable côté Matomo.

## Décision

> Une combinaison est encodée en **une signature stable** (valeurs des réponses jointes dans un ordre de champs figé) portée par l'**Event Name** d'un événement dédié `*_combinaison_soumise`, émis à chaque **soumission valide** du formulaire.

- Sérialisation pure et déterministe dans [`src/shared/analytics/combinaison.ts`](../../src/shared/analytics/combinaison.ts) : `serialiseCombinaisonAbattoirs` / `serialiseCombinaisonEtablissements`. Ordre = ordre des questions, séparateur `>`, booléens → `oui`/`non`, `statut` null → `na`.
- Nouveau step `MATOMO_STEPS.COMBINAISON = "combinaison_soumise"` → actions `abattoir_combinaison_soumise` / `autre_combinaison_soumise`.
- Émission au point d'injection unique existant : `handle*Submit` de [`SimulateursIndexPage.tsx`](../../src/features/simulateurs/pages/SimulateursIndexPage.tsx), là où l'objet `inputs` complet est disponible.

Côté Matomo, le rapport **Comportement → Événements** classe nativement les Event Names par fréquence : les combinaisons dominantes ressortent sans configuration.

## Options envisagées

### Option A — Event Name = signature de la combinaison (retenue)

- Avantages :
  - Classement des combinaisons les plus fréquentes **out-of-the-box** dans le rapport Événements (répond directement au besoin de polarisation)
  - Aucune configuration d'administration Matomo requise
  - Réutilise l'infrastructure existante (`trackEvent` + `options.name`)
- Inconvénients :
  - Les signatures sont des chaînes à interpréter (une **légende** est maintenue dans `docs/matomo-funnel.md`)
  - Cardinalité élevée (jusqu'à 2 744 combinaisons Abattoirs, plus pour Établissements) : Matomo tronque au-delà du top-N par action, acceptable puisqu'on cherche justement le top-N

### Option B — Une custom dimension par question

- Avantages : analyse question par question, segmentation fine
- Inconvénients : **reconstituer** une combinaison à partir de 6-9 dimensions nécessite le plugin Custom Reports (payant) ou de la segmentation lourde ; ne donne pas le classement de combinaisons recherché

### Option C — Tracker chaque changement de réponse (par champ)

- Avantages : mesure aussi les abandons/allers-retours par question
- Inconvénients : génère des combinaisons **partielles et bruitées** (états intermédiaires, re-sélections) qui faussent le classement ; répond à une autre question (friction par étape) que la polarisation des combinaisons soumises

## Conséquences

### Positives

- Besoin couvert avec ~40 lignes et zéro dépendance, cohérent avec l'ADR-0008
- Sérialiseur pur, testé (déterminisme, ordre, cas `na`), sans import React
- Funnels inchangés : la combinaison est un event distinct, l'Event Name n'entre pas dans le matching de funnel (sur l'action)

### Négatives / Risques

- **Stabilité de la signature** : changer l'ordre des champs ou le format fragmente les agrégats historiques Matomo. Toute évolution doit être documentée (nouvelle « version » d'encodage) plutôt que silencieuse.
- Interprétation manuelle des signatures (mitigée par la légende).

## Évolution possible (Phase 2, non implémentée)

Ajouter en complément **une custom dimension par question** (action-scoped) pour analyser chaque réponse indépendamment et segmenter les autres rapports. Le pipeline est déjà prêt : `trackEvent` accepte un `Record<dimensionId, string>` et le pattern d'env `VITE_MATOMO_DIMENSION_<NOM>_ID` est géré par [`matomo.env.ts`](../../src/shared/analytics/matomo.env.ts). Étapes le jour venu :

1. Déclarer les dimensions dans **Administration → Sites web → Dimensions personnalisées** (portée « Action »).
2. Renseigner les `VITE_MATOMO_DIMENSION_*_ID` sur Scalingo.
3. Passer le snapshot des réponses en 3ᵉ argument de `trackEvent` lors de la soumission.

Cette phase reste **optionnelle** : l'Option A seule répond au besoin initial de polarisation.

## Liens

- Sérialiseur : [`src/shared/analytics/combinaison.ts`](../../src/shared/analytics/combinaison.ts)
- Events : [`src/shared/analytics/events.ts`](../../src/shared/analytics/events.ts)
- Émission : [`src/features/simulateurs/pages/SimulateursIndexPage.tsx`](../../src/features/simulateurs/pages/SimulateursIndexPage.tsx)
- Doc Matomo : [`docs/matomo-funnel.md`](../matomo-funnel.md)
- ADR-0008 (wrapper analytics maison)
