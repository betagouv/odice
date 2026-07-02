/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MATOMO_URL?: string;
  readonly VITE_MATOMO_SITE_ID?: string;
  readonly VITE_MATOMO_FUNNEL_ID?: string;
  readonly VITE_DEBUG_MATOMO?: string;
  // Dimensions personnalisées dynamiques : VITE_MATOMO_DIMENSION_<NOM>_ID
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Version injectée au build par Vite (define) depuis le package.json
declare const __APP_VERSION__: string;
