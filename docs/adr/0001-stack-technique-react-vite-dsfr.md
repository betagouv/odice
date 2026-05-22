# ADR-0001 : Stack technique initiale — React 19 + Vite + DSFR + Tailwind

**Date** : 2026-05-20
**Statut** : Accepté

## Contexte

L'outil actuel repose sur un formulaire Grist avec des formules conditionnelles Python. Le principe :

> 5-6 inputs → un moteur de règles → 5-6 outputs.

**Objectif** : remplacer ce formulaire par une application web maintenable et évolutive au gré des évolutions réglementaires PPA.

## Décision

Nous retenons une application **React 19 + Vite** côté front, avec **TypeScript strict + Zod** pour la validation, **DSFR + Tailwind** pour l'UI, déployée en build statique sur **Scalingo via GitHub**. Le moteur de règles est un module **TypeScript pur** (`src/engine/`), testé unitairement, modifié par PR.

### React 19 + Vite (et non Next.js)

L'application est un outil professionnel interne, non indexé par les moteurs de recherche. Le choix de React 19 avec Vite plutôt que Next.js se justifie par :

- **Aucun besoin de SEO** : l'outil n'a pas vocation à être référencé
- **Aucun besoin de SSR** : tout le calcul est côté client, il n'y a pas de data fetching serveur
- **Aucun besoin d'API routes** : pas de backend applicatif
- **Build plus rapide** : Vite offre un temps de build et un rechargement en développement significativement plus rapides que Next.js
- **Moins de complexité** : pas de boilerplate lié à l'App Router, aux Server Components ou au routing serveur

Next.js n'apporterait aucun bénéfice fonctionnel sur ce projet et ajouterait de la complexité d'infrastructure inutile.

## Options envisagées

### Option 1 — MVP 2 simulateurs sans édition des règles (retenue)

**Principe** : application React autonome avec logique métier via des règles en TypeScript.

**Périmètre** : 2 simulateurs au sein de la même application :

- Simulateur pour les abattoirs
- Simulateur pour les autres typologies d'établissements / acteurs publics

**Stack & choix techniques** :

- React 19 + Vite
- TypeScript strict, Zod
- Design system : DSFR + Tailwind
- Déploiement / Hébergement : Scalingo + GitHub

**Logique métier** : les règles sont implémentées dans un module TypeScript (`src/engine/rules.ts`), testées unitairement. Chaque modification réglementaire passe par une PR → review / merge et redéploiement.

**Avantages** :

- Simplicité d'infrastructure serveur (pas de base de données)
- 100% testable et versionné dans GitHub
- Performant (tout tourne côté client)
- Rapide à livrer

**Inconvénients** :

- Toute modification de règle nécessite un développeur
- Pas d'autonomie métier sur l'évolution des règles

### Option 2 — Next.js + base de données + back-office d'édition des règles

**Principe** : application full-stack permettant à l'équipe métier de modifier les règles via une interface admin.

**Inconvénients** :

- SSR/SEO non nécessaires (gaspillage)
- Backend + DB à maintenir
- Complexité d'authentification, de versionnement des règles, de prévisualisation
- Time-to-MVP significativement plus long

Reporté à un éventuel jalon ultérieur si le besoin d'autonomie métier devient bloquant.

### Option 3 — `@codegouvfr/react-dsfr` (wrapper React du DSFR)

**Principe** : utiliser les composants React typés du DSFR plutôt que la version CSS+JS directe.

**Inconvénients** :

- Couche d'abstraction supplémentaire à maintenir/upgrader
- Divergence avec le projet voisin Mutafriches (qui utilise DSFR direct)
- Moins de flexibilité sur le markup HTML produit

## Conséquences

### Positives

- Cohérence inter-projets Beta.gouv (mêmes scripts, conventions, hooks Claude que Mutafriches)
- Build statique simple à déployer sur Scalingo
- Moteur de règles isolé (`src/engine/`) testable en pur TypeScript, sans dépendance UI
- Vérification automatisée via `pnpm validate` (format + lint + typecheck + tests)
- Modification réglementaire = PR tracée + tests + déploiement reproductible

### Négatives / Risques

- Composants DSFR à écrire à la main (Layout, Header, Footer, formulaires)
- Mise à jour du DSFR à faire manuellement (suivre `@gouvfr/dsfr` releases)
- Accessibilité non garantie automatiquement : à valider à chaque ajout de composant
- Pas d'autonomie métier sur les règles : chaque évolution réglementaire passe par un développeur (cf. Option 2 si le besoin se confirme)

### Migration

Sans objet (projet en bootstrap, pas de code existant à migrer).

## Liens

- [package.json](../../package.json)
- [vite.config.ts](../../vite.config.ts)
- [src/engine/](../../src/engine/)
- [CLAUDE.md](../../CLAUDE.md)
- DSFR : <https://www.systeme-de-design.gouv.fr>
- Mutafriches (projet voisin de référence) : `/Users/sam/Src/Beta.gouv/mutafriches`
