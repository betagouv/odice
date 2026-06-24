// Lecture + validation Zod des variables Matomo exposées au bundle (VITE_*).
// SPA statique : aucun secret ici (cf. CLAUDE.md "Variables d'environnement").

import { z } from "zod";

// Coerce "true"/true vers boolean ; undefined -> false.
const booleanFromEnv = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => value === true || value === "true");

const matomoEnvSchema = z.object({
  url: z.url().optional(),
  siteId: z.string().min(1).optional(),
  funnelId: z.string().min(1).optional(),
  debug: booleanFromEnv,
  // Dimensions personnalisées : nom logique -> id numérique Matomo.
  dimensions: z.record(z.string(), z.coerce.number().int().positive()),
});

export type MatomoEnv = z.infer<typeof matomoEnvSchema>;

export interface MatomoSettings {
  env: MatomoEnv;
  /** init + envoi réel : env complètes ET build production. */
  enabled: boolean;
  /** log des events sans envoi (activable en dev via VITE_DEBUG_MATOMO). */
  debug: boolean;
}

const DIMENSION_KEY = /^VITE_MATOMO_DIMENSION_(.+)_ID$/;

const DISABLED: MatomoSettings = {
  env: { debug: false, dimensions: {} },
  enabled: false,
  debug: false,
};

// Fonction pure (testable) : parse un environnement brut et décide de l'activation.
export function parseMatomoEnv(
  rawEnv: Record<string, string | undefined>,
  isProd: boolean,
): MatomoSettings {
  const dimensions: Record<string, string | undefined> = {};
  for (const key of Object.keys(rawEnv)) {
    const match = DIMENSION_KEY.exec(key);
    if (match) dimensions[match[1].toLowerCase()] = rawEnv[key];
  }

  const result = matomoEnvSchema.safeParse({
    url: rawEnv.VITE_MATOMO_URL,
    siteId: rawEnv.VITE_MATOMO_SITE_ID,
    funnelId: rawEnv.VITE_MATOMO_FUNNEL_ID,
    debug: rawEnv.VITE_DEBUG_MATOMO,
    dimensions,
  });

  if (!result.success) {
    // Analytics ne doit jamais casser l'app : on désactive sur configuration invalide.
    console.warn("[ODICE matomo] configuration invalide, analytics désactivé", result.error.issues);
    return DISABLED;
  }

  const env = result.data;
  const hasCore = Boolean(env.url && env.siteId);
  return { env, enabled: isProd && hasCore, debug: env.debug };
}

export const matomoSettings: MatomoSettings = parseMatomoEnv(
  import.meta.env as unknown as Record<string, string | undefined>,
  import.meta.env.PROD,
);
