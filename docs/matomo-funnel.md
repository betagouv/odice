# Mesure d'audience Matomo — funnel du parcours simulateur

ODICE envoie à Matomo une page vue à chaque navigation et des événements le long du parcours simulateur. Ce document décrit le funnel à créer côté Matomo. L'intégration technique est décrite dans [ADR-0008](./adr/0008-analytics-matomo-wrapper-maison.md).

## Événements émis

Tous les événements portent la **catégorie** `Simulateur PPA`. Le **simulateur est encodé dans l'action** (préfixe `abattoir_` ou `autre_`) afin de définir **deux funnels Matomo distincts** sans recourir aux segments. Source : [`src/shared/analytics/events.ts`](../src/shared/analytics/events.ts), émis depuis [`src/features/simulateurs/pages/SimulateursIndexPage.tsx`](../src/features/simulateurs/pages/SimulateursIndexPage.tsx).

| Étape | Action — Abattoirs | Action — Autres établissements | Déclencheur |
|---|---|---|---|
| Ouvert | `abattoir_simulateur_ouvert` | `autre_simulateur_ouvert` | Choix d'un type d'établissement |
| Lancée | `abattoir_simulation_lancee` | `autre_simulation_lancee` | Soumission valide du formulaire |
| Combinaison | `abattoir_combinaison_soumise` | `autre_combinaison_soumise` | Soumission valide — **Event Name = signature des réponses** |
| Résultat | `abattoir_resultat_affiche` | `autre_resultat_affiche` | Résultat calculé et affiché |
| Réinitialisation | `abattoir_reinitialisation` | `autre_reinitialisation` | Clic sur « Réinitialiser » (pas une simple saisie) |

Rappel : le tracking n'est actif **qu'en build production** et seulement si `VITE_MATOMO_URL` + `VITE_MATOMO_SITE_ID` sont renseignés (cf. [`.env.example`](../.env.example)).

## Prérequis

Le suivi de funnel nécessite le plugin **Funnels** de Matomo (inclus sur Matomo Cloud, installable sur instance auto-hébergée). Menu : **Objectifs → Funnels → Gérer les funnels**.

## Deux funnels (un par simulateur)

### Funnel « Simulateur Abattoirs » (4 étapes)

| # | Étape | Correspondance | Valeur |
|---|---|---|---|
| 1 | Accès simulateur | URL contient | `/simulateurs` |
| 2 | Simulateur ouvert | Action d'événement (equals) | `abattoir_simulateur_ouvert` |
| 3 | Simulation lancée | Action d'événement (equals) | `abattoir_simulation_lancee` |
| 4 | Résultat affiché | Action d'événement (equals) | `abattoir_resultat_affiche` |

### Funnel « Simulateur Autres établissements » (4 étapes)

| # | Étape | Correspondance | Valeur |
|---|---|---|---|
| 1 | Accès simulateur | URL contient | `/simulateurs` |
| 2 | Simulateur ouvert | Action d'événement (equals) | `autre_simulateur_ouvert` |
| 3 | Simulation lancée | Action d'événement (equals) | `autre_simulation_lancee` |
| 4 | Résultat affiché | Action d'événement (equals) | `autre_resultat_affiche` |

Laisser les funnels en mode **non strict** : les étapes se suivent dans l'ordre naturel, inutile d'interdire les sauts. Plus besoin de segment : chaque funnel ne matche que ses propres actions préfixées.

## Points d'attention

- **Étape 3 → 4 ≈ 100 %.** L'évaluation est synchrone et n'échoue jamais côté utilisateur : un écart `*_simulation_lancee → *_resultat_affiche` signale une **erreur JS** (captée par l'ErrorBoundary), pas un abandon. Pour un funnel purement comportemental, on peut fusionner les étapes 3 et 4 en une seule « Simulation aboutie » sur `*_resultat_affiche`.
- **La réinitialisation n'est pas une étape de funnel** (c'est une friction, pas une progression). La créer comme **Objectif** séparé (Action = `abattoir_reinitialisation` / `autre_reinitialisation`) pour mesurer le taux de remise à zéro.
- Les points d'abandon réellement utiles à observer sont **1 → 2** (arrivée sans choix de type) et **2 → 3** (formulaire ouvert mais non soumis = formulaire trop long ou complexe).

## Combinaisons de réponses (polarisation des besoins)

Pour mesurer **quelles combinaisons de réponses sont les plus soumises**, chaque soumission valide émet un event `*_combinaison_soumise` dont l'**Event Name est une signature** de toutes les réponses. Décision : [ADR-0010](./adr/0010-tracking-combinaisons-event-name.md). Sérialisation : [`src/shared/analytics/combinaison.ts`](../src/shared/analytics/combinaison.ts).

### Où lire le classement

**Comportement → Événements**, filtrer sur la catégorie `Simulateur PPA`, ouvrir l'action `abattoir_combinaison_soumise` (ou `autre_combinaison_soumise`), puis le sous-tableau **Nom de l'événement** trié par nombre décroissant. Les combinaisons en tête = besoins dominants.

### Format de la signature

Les réponses sont jointes par `>` **dans l'ordre des questions du formulaire**. La position encode la question, la valeur encode la réponse. Booléens → `oui`/`non`, `statut` non applicable → `na`.

**Abattoirs** (6 champs) : `zoneSuides > statut > zoneAbattoir > mcaAbattoir > zoneEtbDestinataire > mcaEtbDestinataire`

> Exemple : `zrii>mr-ppa>zs>oui>zri>non`
> = suidés en ZRII, statut MR-PPA, abattoir en ZS avec agrément MCA, établissement destinataire en ZRI sans agrément MCA.

**Autres établissements** (9 champs) : `zoneSuides > marqueViandes > traitementObligatoireFr > traitementObligatoireUe > zoneExpediteur > mcaExpediteur > traitementRealise > zoneDestinataire > mcaDestinataire`

> Exemple : `zp>ovale-barree>oui>non>zs>oui>non>zone-indemne>oui`

Codes de zones : `zone-indemne`, `zp`, `zs`, `zi-fs`, `zri`, `zrii`, `zriii`. Statuts : `mr-ppa`, `mnr-ppa`. Marques : `ovale`, `ovale-barree`, `ovale-diagonales-paralleles`.

### Points d'attention

- **Stabilité** : l'ordre des champs et le format sont figés (cf. ADR-0010). Les modifier fragmente les agrégats historiques.
- **Cardinalité** : jusqu'à 2 744 combinaisons Abattoirs (plus pour Établissements). Matomo ne conserve que le top ~500 Names par action, le reste tombe dans « Others » — sans impact pour l'analyse de polarisation (top-N). Pour l'exhaustivité, augmenter `datatable_archiving_maximum_rows_events` côté serveur.
- **Analyse par question** (indépendante des combinaisons) : non implémentée, décrite en Phase 2 de l'[ADR-0010](./adr/0010-tracking-combinaisons-event-name.md).

## `VITE_MATOMO_FUNNEL_ID`

La variable est lue et validée par le module mais **pas encore consommée** par le code. Une fois le funnel créé, Matomo lui attribue un ID : le poser dans cette variable n'est utile que si l'on souhaite plus tard référencer le funnel côté code (API Funnels, tracking explicite). Pour un funnel défini entièrement dans l'UI Matomo, ce n'est pas nécessaire.
