# ADR-0007 : Analytics Matomo via wrapper maison (sans lib tierce)

**Date** : 2026-06-24
**Statut** : Accepté

## Contexte

ODICE doit mesurer son audience (pages vues, parcours dans les simulateurs) avec Matomo, solution déjà acceptée et hébergée côté Beta.gouv (RGPD natif). Une intégration de référence existe sur un projet Next.js de l'équipe, basée sur `@socialgouv/matomo-next` — package **spécifique à Next.js** (couplé au routeur Next), donc inutilisable tel quel sur la stack ODICE (React 19 + Vite + React Router).

Il faut donc reproduire l'architecture (validation d'env, provider, hook typé, constantes d'events) en l'adaptant à React/Vite. La question ouverte : comment alimenter `window._paq` — via une lib React générique ou via un petit wrapper maison.

## Décision

> Nous utilisons un **wrapper maison** autour de `window._paq` (injection du snippet Matomo officiel + fonction `push`) plutôt qu'une dépendance tierce, regroupé dans le module `src/shared/analytics/`.

Architecture :

```
src/shared/analytics/
├── matomo.env.ts        # validation Zod des VITE_MATOMO_* + flag d'activation
├── matomo.client.ts     # wrapper bas niveau : init() + push() sur window._paq
├── events.ts            # constantes d'events (as const) + type union dérivé
├── Matomo.tsx           # provider : init unique + page view sur changement de route
├── useMatomo.ts         # hook typé : trackEvent / trackPageView / enableHeatmaps
└── index.ts             # API publique du module
```

Décisions clés :

- Init et tracking **uniquement en build production** ET si `VITE_MATOMO_URL` + `VITE_MATOMO_SITE_ID` sont présents (sinon module totalement inerte).
- Page view re-déclenchée à chaque navigation via `useLocation` de React Router (`setCustomUrl` + `trackPageView`).
- Custom dimensions toujours **set -> track -> delete** pour ne pas polluer les events suivants.
- Mode debug (`VITE_DEBUG_MATOMO`) qui logue les events en console sans les envoyer ; tout est wrappé en try/catch (l'analytics ne doit jamais casser l'app).

## Options envisagées

### Option A — Wrapper maison `window._paq` (retenue)

- Avantages :
  - Zéro dépendance ajoutée (cohérent avec l'ADR-0005 « monitoring maison » et la culture Beta.gouv)
  - ~30 lignes, exactement ce que fait `@socialgouv/matomo-next` en interne
  - Contrôle total de `_paq` : `setCustomUrl`, `setCustomDimension`/`deleteCustomDimension`, funnel, `HeatmapSessionRecording::enable` sans contournement
  - Rien à auditer ni à mettre à jour côté supply chain
- Inconvénients :
  - Snippet de chargement à maintenir nous-mêmes
  - Pas de typage fourni par un package (compensé par notre hook typé)

### Option B — `@jonkoops/matomo-tracker-react`

- Avantages :
  - Lib React générique, maintenue, fournit un provider + hook
- Inconvénients :
  - Dépendance externe à auditer/mettre à jour
  - API ne couvre pas tous les appels avancés → retour à `push` brut de toute façon
  - Surcouche peu rentable vu la simplicité du besoin

### Option C — `@socialgouv/matomo-next`

- Avantages : intégration de référence déjà connue de l'équipe
- Inconvénients : **couplé à Next.js** (usePathname/useSearchParams, App Router), inadapté à Vite + React Router

## Conséquences

### Positives

- Infrastructure analytics livrée et inerte par défaut : aucun impact sur le dev, les tests ou un build sans variables Matomo
- Validation Zod centralisée des env (`matomo.env.ts`), fail-safe : configuration invalide -> analytics désactivé + warn, jamais d'exception
- Hook `useMatomo()` réutilisable, events centralisés (`MATOMO_EVENTS`) prêts à être branchés
- 8 tests unitaires couvrent le parsing d'env et l'ordre set/track/delete

### Négatives / Risques

- Le snippet de chargement Matomo est maintenu en interne (à ajuster si Matomo change sa convention `matomo.js`/`matomo.php`)
- Les événements de funnel ne sont pas encore branchés dans les formulaires (périmètre volontairement limité à l'infrastructure)

### Migration (si applicable)

- Instrumenter les parcours : appeler `trackEvent(MATOMO_EVENTS.*)` dans `AbattoirsForm` / `EtablissementsForm` (ouverture, soumission, résultat, réinitialisation), en ignorant le premier render via une ref
- Renseigner `VITE_MATOMO_URL` + `VITE_MATOMO_SITE_ID` sur l'environnement de production Scalingo
- Si une CSP est ajoutée plus tard, autoriser le domaine Matomo en `script-src`, `img-src`, `connect-src`
- Compléter la page « Gestion des cookies » avec la mention de la mesure d'audience

## Liens

- Validation d'env : [`src/shared/analytics/matomo.env.ts`](../../src/shared/analytics/matomo.env.ts)
- Wrapper bas niveau : [`src/shared/analytics/matomo.client.ts`](../../src/shared/analytics/matomo.client.ts)
- Provider : [`src/shared/analytics/Matomo.tsx`](../../src/shared/analytics/Matomo.tsx)
- Hook : [`src/shared/analytics/useMatomo.ts`](../../src/shared/analytics/useMatomo.ts)
- Events : [`src/shared/analytics/events.ts`](../../src/shared/analytics/events.ts)
- Montage : [`src/App.tsx`](../../src/App.tsx)
- Exemple d'env : [`.env.example`](../../.env.example)
- ADR-0005 (monitoring maison), CLAUDE.md sections « Variables d'environnement » et « Monitoring des erreurs »
