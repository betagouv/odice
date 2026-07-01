# ADR-0009 : Mesure d'audience Matomo sans cookie (cookieless)

**Date** : 2026-07-01
**Statut** : Accepté

## Contexte

ODICE mesure sa fréquentation avec Matomo (cf. [ADR-0008](./0008-analytics-matomo-wrapper-maison.md)). Par défaut, le tracker Matomo dépose des cookies (`_pk_id`, `_pk_ses`) pour reconnaître un visiteur d'une session à l'autre.

Se pose alors la question RGPD : faut-il un bandeau de consentement ? La CNIL impose que toute mesure d'audience soit **soit exemptée de consentement** (sous conditions strictes : anonymisation, finalité limitée, mécanisme d'opposition), **soit soumise à consentement** (bandeau). ODICE ne fait *que* de la mesure d'audience anonyme, sans compte ni donnée nominative : on veut la conformité la plus simple possible, sans dégrader l'expérience par un bandeau.

## Décision

> Nous configurons Matomo en mode **sans cookie** (`_paq.push(["disableCookies"])`) : aucun cookie n'est déposé sur l'appareil du visiteur.

Conséquences directes :

- Mesure d'audience **exemptée de consentement** au sens de la CNIL → **aucun bandeau de consentement** requis.
- Page « Gestion des cookies » **informative** (pas de centre de préférences ni d'opt-out cookie à gérer).
- Sans cookie, Matomo regroupe les actions en visites via un `config_id` (hash côté serveur, aléatoirement initialisé, à durée de vie de 24 h, propre au site) : ce n'est pas un fingerprint persistant.

## Options envisagées

### Option A — Cookieless (retenue)

- Avantages :
  - Conformité RGPD la plus simple : aucun cookie, aucun bandeau, aucun opt-out cookie à implémenter
  - Cohérent avec un outil sans compte, à finalité unique de mesure d'audience
  - **Fiable pour ce qui compte à ODICE** : visites, pages vues, événements et **funnel du simulateur** restent exacts (métriques intra-visite)
- Inconvénients :
  - **Visiteurs uniques** approximatifs (sur-comptés) : Matomo compte des visites, pas des personnes
  - Pas de « nouveaux vs récurrents » fiable, pas de suivi longitudinal (config_id réinitialisé toutes les 24 h, fenêtre de reconnaissance ~30 min), pas de cohortes ni d'attribution multi-session

### Option B — Cookie-based + opt-out

- Avantages : visiteurs uniques précis, suivi de la récurrence
- Inconvénients : cookies déposés → impose d'informer et de fournir un **mécanisme d'opposition** (opt-out Matomo) ; page cookies à rendre interactive ; complexité accrue pour un bénéfice sans intérêt réel ici

### Option C — Consentement explicite (bandeau)

- Avantages : couvre tous les cas de traceurs
- Inconvénients : friction utilisateur, disproportionné pour une simple mesure d'audience anonyme ; non requis

## Conséquences

### Positives

- Aucun cookie déposé → pas de bandeau de consentement, conformité CNIL directe
- Pages légales simples et cohérentes (« Gestion des cookies » informative, section cookies de la politique de données alignée)
- Les métriques utiles à ODICE (fréquentation, événements, funnel) restent exactes

### Négatives / Risques

- Le comptage des **visiteurs uniques** et des visiteurs récurrents est approximatif
- Pas d'analyse longitudinale (cohortes, attribution multi-session)

### Migration (si un jour un suivi précis des personnes est requis)

1. Retirer `disableCookies` dans [`src/shared/analytics/matomo.client.ts`](../../src/shared/analytics/matomo.client.ts)
2. Rendre la page « Gestion des cookies » interactive (opt-out Matomo) et documenter le droit d'opposition
3. Réévaluer l'exemption de consentement / la nécessité d'un bandeau

## Liens

- Wrapper : [`src/shared/analytics/matomo.client.ts`](../../src/shared/analytics/matomo.client.ts) (`disableCookies`)
- Page cookies : [`src/features/legal/pages/GestionCookiesPage.tsx`](../../src/features/legal/pages/GestionCookiesPage.tsx)
- Politique de données : [`src/features/legal/pages/DonneesPersonnellesPage.tsx`](../../src/features/legal/pages/DonneesPersonnellesPage.tsx)
- [ADR-0008 — Analytics Matomo via wrapper maison](./0008-analytics-matomo-wrapper-maison.md)
- Matomo FAQ 156 — impact du cookieless sur la précision : https://matomo.org/faq/general/faq_156/
- Matomo — traitement du config_id : https://matomo.org/faq/general/how-is-the-visitor-config_id-processed/
