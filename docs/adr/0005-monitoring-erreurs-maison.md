# ADR-0005 : Monitoring des erreurs maison (sans Sentry)

**Date** : 2026-05-23
**Statut** : Accepté (Phase 1)

## Contexte

ODICE est une SPA React statique servie par Scalingo. Aucun backend applicatif → les erreurs JS côté client n'apparaissent **pas** dans les logs serveur.

Sans pipeline de monitoring :
- Un crash de rendu React produit un écran blanc, sans trace
- Une promesse rejetée non gérée disparait silencieusement
- L'équipe découvre les bugs par retours utilisateur ou par hasard

Il faut un système de capture, mais Sentry (la solution « par défaut » de l'industrie) est **disproportionné** pour ce projet : 
- Beta.gouv / DDPP : exigences RGPD strictes, hébergement service tiers à justifier
- Coût ~26 €/mois minimum
- Surface d'erreur faible (peu d'async, peu de logique cliente)

## Décision

> **Phase 1** : système maison léger basé sur l'`ErrorBoundary` React + handlers globaux `window.error` / `unhandledrejection`, qui invoquent un reporter centralisé `reportError(error, context)`. Phase 1 = log structuré via `console.error` uniquement. **Phase 2** (future) : POST du payload vers un endpoint configurable (`VITE_ERROR_ENDPOINT`).

Architecture :

```
src/shared/monitoring/
├── error-reporter.ts          # reportError(error, context) → console.error structuré
└── install-global-handlers.ts # listeners window.error + unhandledrejection

src/shared/components/
└── ErrorBoundary.tsx          # boundary React (Class component)

src/features/error/pages/
└── ErrorFallbackPage.tsx      # UI DSFR page d'erreur (template officiel)
```

Câblage :
- `installGlobalHandlers()` appelé une fois dans `src/main.tsx`
- `<ErrorBoundary fallback={<ErrorFallbackPage />}>` wrappe `<Routes>` dans `src/App.tsx`

## Options envisagées

### Option A — Solution maison Phase 1 + endpoint Phase 2 (retenue)

- Avantages :
  - Zéro dépendance externe (RGPD-friendly)
  - Léger (~150 lignes)
  - Phase 1 immédiate (console DevTools utilisateur = preuve facile à transmettre)
  - Phase 2 évolutive sans refonte
  - Maîtrise totale du payload émis
- Inconvénients :
  - Pas de regroupement automatique d'erreurs
  - Pas de symbolication sourcemap distante
  - Visibilité Phase 1 limitée à l'utilisateur (console)

### Option B — Sentry (cloud ou self-hosted GlitchTip)

- Avantages :
  - Outil industrie standard, regroupement, symbolication, alertes
- Inconvénients :
  - RGPD : DPA à signer ; pour Beta.gouv, hébergement tiers à justifier
  - Coût : 26 €/mois minimum (cloud)
  - GlitchTip self-hosted = instance à maintenir → autre incident potentiel
  - Overkill pour la taille du projet à ce stade

### Option C — Plausible / Matomo custom events

- Avantages : RGPD natif, déjà accepté Beta.gouv
- Inconvénients : ce n'est pas un outil d'erreur (pas de stack trace structurée, pas de regroupement)

### Option D — Aucun monitoring

- Avantages : zéro effort
- Inconvénients : aveugle ; bugs réglementaires non détectés = risque métier

## Conséquences

### Positives (Phase 1 livrée)

- Tout crash React est attrapé par l'`ErrorBoundary` → page d'erreur DSFR officielle
- Toute erreur JS non gérée (`window.error`) et toute promesse rejetée (`unhandledrejection`) sont loguées structurées via `console.error("[ODICE error]", payload)`
- Payload structuré : `{ timestamp, message, stack, url, userAgent, context }` — prêt à être POSTé en Phase 2
- L'utilisateur garde une voie de sortie (bouton « Recharger la page » ou « Retour à l'accueil ») au lieu d'un écran blanc
- 3 tests unitaires couvrent le reporter

### Négatives / Risques

- Sans endpoint Phase 2, les erreurs en prod **ne remontent pas** automatiquement à l'équipe — il faut que l'utilisateur signale + envoie un screenshot console
- Le format du payload est maison → si on migre vers Sentry plus tard, refonte du reporter
- L'absence de regroupement signifie que 100 erreurs identiques = 100 lignes à parcourir

### Migration (Phase 2 — futur)

Quand l'équipe décide d'activer le reporting distant :

1. Choisir l'endpoint : webhook Discord/Mattermost OU petit endpoint Scalingo Node
2. Documenter la variable d'env `VITE_ERROR_ENDPOINT`
3. Ajouter le `fetch` POST dans `reportError` (conditionnel sur la présence de la variable)
4. Ajouter une mention RGPD dans la politique de données personnelles si le payload contient quoi que ce soit d'identifiant
5. Tests unitaires : mock `fetch`, vérifier le payload envoyé

## Liens

- Reporter : [`src/shared/monitoring/error-reporter.ts`](../../src/shared/monitoring/error-reporter.ts)
- Handlers globaux : [`src/shared/monitoring/install-global-handlers.ts`](../../src/shared/monitoring/install-global-handlers.ts)
- ErrorBoundary : [`src/shared/components/ErrorBoundary.tsx`](../../src/shared/components/ErrorBoundary.tsx)
- Page d'erreur : [`src/features/error/pages/ErrorFallbackPage.tsx`](../../src/features/error/pages/ErrorFallbackPage.tsx)
- CLAUDE.md, section « Monitoring des erreurs »
