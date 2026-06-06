# Versionnage des règles métier ODICE

Chaque simulateur ODICE est lié à un arrêté officiel. Toute évolution réglementaire fait l'objet d'une **nouvelle version**, ajoutée via pull request.

## Où les versions sont stockées

Une seule source de vérité par simulateur :

| Simulateur | Fichier |
|---|---|
| Abattoirs | [`src/engine/abattoirs/versions.ts`](../src/engine/abattoirs/versions.ts) |
| Établissements | (à venir : `src/engine/etablissements/versions.ts`) |

La constante `ABATTOIRS_VERSIONS` est un tableau **ordonné antéchronologiquement** : `[0]` = version courante.

La date courante est automatiquement affichée :
- dans le panneau de résultats du simulateur (« Dernière mise à jour : … »),
- dans la page [`/historique-versions`](../src/features/historique/pages/HistoriqueVersionsPage.tsx).

## Procédure PR pour ajouter une nouvelle version

Suivre ces étapes dans l'ordre :

1. **Récupérer les nouvelles sources** auprès de l'équipe métier (xlsx de test + docx de formules).
2. **Copier les sources datées** dans `docs/sources/` :
   ```
   docs/sources/abattoirs-formules-YYYYMMDD.docx
   docs/sources/abattoirs-test-formules-YYYYMMDD.xlsx
   ```
3. **Mettre à jour `SOURCE_XLSX`** dans [`scripts/extract-abattoirs-fixture.ts`](../scripts/extract-abattoirs-fixture.ts) si le nom de fichier a changé (typiquement la date).
4. **Regénérer la fixture** :
   ```bash
   pnpm fixture:abattoirs
   ```
5. **Inspecter le diff** :
   ```bash
   git diff tests/fixtures/abattoirs/oracle-2744.json
   ```
   Identifier les combinaisons d'entrées qui ont changé de résultat.
6. **Adapter les règles** dans `src/engine/abattoirs/rules/*.ts` (et leurs specs ciblés) jusqu'à ce que `pnpm test` repasse à 100 %.
7. **Ajouter une entrée en tête** de `ABATTOIRS_VERSIONS` dans [`src/engine/abattoirs/versions.ts`](../src/engine/abattoirs/versions.ts) :
   ```ts
   {
     dateEffet: "YYYY-MM-DD",
     arrete: {
       titre: "Arrêté du DD MMMM YYYY relatif à …",
       reference: "NOR XXX",
       url: "https://www.legifrance.gouv.fr/…",
     },
     sources: [
       "docs/sources/abattoirs-formules-YYYYMMDD.docx",
       "docs/sources/abattoirs-test-formules-YYYYMMDD.xlsx",
     ],
     changements: [
       "Liste courte des règles modifiées vs version précédente.",
     ],
     pullRequest: "https://github.com/.../pull/XXX",
   },
   ```
8. **Vérifier** :
   ```bash
   pnpm validate
   ```
   La spec `versions.spec.ts` garantit notamment l'ordre antéchronologique strict des dates.
9. **Commit unique** suivant Conventional Commits :
   ```
   feat(abattoirs): nouvelle version YYYY-MM-DD

   Adapte les règles X et Y suite à l'arrêté NOR XXX.
   ```
10. **Ouvrir la PR** et compléter le champ `pullRequest` avec son URL avant le merge.

## Vérification post-merge

Après merge :
- La page [/historique-versions](/historique-versions) liste la nouvelle version.
- La date « Dernière mise à jour » dans le panneau de résultats du simulateur reflète la dernière entrée.

## Si la structure du xlsx change

Si les colonnes du xlsx changent (nouveau champ d'entrée, nouvelle sortie…), le script `extract-abattoirs-fixture.ts` échoue avec un message explicite. C'est un changement de **modèle** métier, pas juste une nouvelle version : il faut alors mettre à jour aussi `src/engine/abattoirs/types.ts`, les rules concernées et probablement l'UI. Voir les principes DDD dans [CLAUDE.md](../CLAUDE.md#architecture).
