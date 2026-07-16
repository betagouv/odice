# Mesure d'audience Matomo — funnel du parcours simulateur

ODICE envoie à Matomo une page vue à chaque navigation et des événements le long du parcours simulateur. Ce document décrit le funnel à créer côté Matomo. L'intégration technique est décrite dans [ADR-0008](./adr/0008-analytics-matomo-wrapper-maison.md).

## Événements émis

Tous les événements portent la **catégorie** `Simulateur PPA`. Le **simulateur est encodé dans l'action** (préfixe `abattoir_` ou `autre_`) afin de définir **deux funnels Matomo distincts** sans recourir aux segments. Source : [`src/shared/analytics/events.ts`](../src/shared/analytics/events.ts), émis depuis [`src/features/simulateurs/pages/SimulateursIndexPage.tsx`](../src/features/simulateurs/pages/SimulateursIndexPage.tsx).

| Étape | Action — Abattoirs | Action — Autres établissements | Déclencheur |
|---|---|---|---|
| Ouvert | `abattoir_simulateur_ouvert` | `autre_simulateur_ouvert` | Choix d'un type d'établissement |
| Lancée | `abattoir_simulation_lancee` | `autre_simulation_lancee` | Soumission valide du formulaire |
| Combinaison | `abattoir_combinaison_soumise` | `autre_combinaison_soumise` | Soumission valide — **Event Name = signature des réponses** |
| Résultat | `abattoir_resultat_affiche` | `autre_resultat_affiche` | Résultat calculé et affiché — **porte les dimensions type + zone** (cf. plus bas) |
| Durée de saisie | `abattoir_duree_saisie` | `autre_duree_saisie` | Validation — **Event Value = secondes** depuis la 1ère saisie (zone d'origine) |
| Réinitialisation | `abattoir_reinitialisation` | `autre_reinitialisation` | Clic sur « Réinitialiser » (pas une simple saisie) |

### Événements de clic vers les pages annexes

Catégorie identique (`Simulateur PPA`), hors funnel. Émis depuis la navigation, les indices de carte et les panneaux résultat.

| Action | Déclencheur |
|---|---|
| `clic_aide_utilisation` | Clic sur « Aide à l'utilisation » (menu) |
| `clic_documentation_reglementaire` | Clic sur « Documentation réglementaire » (menu **ou** lien du panneau résultat) |
| `clic_carte_zones` | Clic sur le lien « carte » sous un champ de zone (carte des zones réglementées) |

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

## Dimensions personnalisées (profils utilisateurs)

Deux **custom dimensions action-scope** sont émises sur l'event `*_resultat_affiche` (validation d'une simulation) pour ventiler les validations par profil. Source : [`src/shared/analytics/dimensions.ts`](../src/shared/analytics/dimensions.ts).

| Nom logique | Variable d'env | Valeur émise |
|---|---|---|
| `type_etablissement` | `VITE_MATOMO_DIMENSION_TYPE_ETABLISSEMENT_ID` | Type fin choisi : `abattoir`, `atelier-decoupe`, `entrepot`, `transformation`, `cuisine-centrale` |
| `zone_suides` | `VITE_MATOMO_DIMENSION_ZONE_SUIDES_ID` | Zone d'origine des suidés : `zone-indemne`, `zp`, `zs`, `zi-fs`, `zri`, `zrii`, `zriii` |

**Mise en place** :

1. Matomo → **Administration → Sites web → Gérer les dimensions personnalisées** : créer 2 dimensions **de type « Action »** (`type_etablissement`, `zone_suides`), les activer.
2. Relever l'**ID** de chaque dimension (colonne « ID »).
3. Poser `VITE_MATOMO_DIMENSION_TYPE_ETABLISSEMENT_ID` et `VITE_MATOMO_DIMENSION_ZONE_SUIDES_ID` (Scalingo) et rebuild.

Sans ces IDs, la validation est trackée normalement mais **sans** dimension (aucune fuite). Lecture : **Comportement → Événements → `*_resultat_affiche`**, segmenter/scinder par la dimension ; ou rapport dédié **Comportement → Dimensions personnalisées**.

## Indicateurs pilotés (récapitulatif)

Où lire chaque indicateur demandé. « Personnes / mois » = **nombre de visiteurs uniques** sur la période (colonne dédiée des rapports Événements). Régler la période sur **Mois**.

| Indicateur | Où le lire dans Matomo |
|---|---|
| **Utilisation** — simulations validées / mois | Événements → actions `*_resultat_affiche` (somme des deux, ou par simulateur) |
| Arrivées sur la landing / mois | Comportement → Pages → `/` (visiteurs uniques) |
| Personnes démarrant un 1er simulateur / mois | Événements → `*_simulateur_ouvert` → visiteurs uniques |
| Personnes validant un 1er simulateur / mois | Événements → `*_resultat_affiche` → visiteurs uniques |
| Personnes réinitialisant / mois | Événements → `*_reinitialisation` → visiteurs uniques |
| Personnes réinitialisant **et** validant / mois | Créer un **segment** `eventAction==abattoir_reinitialisation,eventAction==autre_reinitialisation`, l'appliquer au rapport `*_resultat_affiche` |
| Temps moyen 1ère saisie → validation | Événements → `*_duree_saisie` → colonne **Valeur moyenne** (secondes) |
| Validations par type d'établissement (+ région) / mois | Dimension `type_etablissement` (ci-dessus), croisée avec **Visiteurs → Lieux → Région** (géolocalisation IP) |
| Validations par zone d'origine des suidés | Dimension `zone_suides` (ci-dessus) |
| Clics vers notice (aide) / mois | Événements → `clic_aide_utilisation` |
| Clics vers documentation réglementaire / mois | Événements → `clic_documentation_reglementaire` |
| Clics vers « carte des zones réglementées » / mois | Événements → `clic_carte_zones` |

**Région** : aucun champ région/département n'existe dans le formulaire (la géographie métier est en « zones » réglementaires PPA). L'axe « région » repose sur la **géolocalisation par IP** native de Matomo (rapport **Visiteurs → Lieux**) — approximatif (localisation du navigateur, pas de l'établissement). Un champ région dédié serait une évolution produit à part entière.

> **Évolution envisagée** : un pilotage plus fin (cross-tabs profils exacts, comptage de personnes mesuré via un identifiant anonyme persistant, distributions de durée) via un sink d'événements Postgres + Metabase, en complément de Matomo. Orientation et prérequis RGPD détaillés dans [ADR-0012](./adr/0012-pilotage-hybride-matomo-postgres-metabase.md).

## `VITE_MATOMO_FUNNEL_ID`

La variable est lue et validée par le module mais **pas encore consommée** par le code. Une fois le funnel créé, Matomo lui attribue un ID : le poser dans cette variable n'est utile que si l'on souhaite plus tard référencer le funnel côté code (API Funnels, tracking explicite). Pour un funnel défini entièrement dans l'UI Matomo, ce n'est pas nécessaire.
