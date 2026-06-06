# Fixtures de test — Simulateur Abattoirs

## Origine

Le fichier `oracle-2744.json` est généré automatiquement depuis le xlsx source maintenu par l'équipe métier :

- Source : [`docs/sources/abattoirs-test-formules-20260512.xlsx`](../../../docs/sources/abattoirs-test-formules-20260512.xlsx)
- Sheet : `ABATTOIRS`
- Volume : 2 744 combinaisons (combinatoire complète des 6 inputs)

## Régénération

Quand l'équipe métier livre un nouveau xlsx :

```bash
# 1. Remplacer le fichier source (nouveau nom daté)
cp /chemin/vers/nouveau-test-formules.xlsx \
   docs/sources/abattoirs-test-formules-YYYYMMDD.xlsx

# 2. Mettre à jour SOURCE_XLSX dans scripts/extract-abattoirs-fixture.mjs
#    si le nom de fichier a changé (typiquement la date).

# 3. Régénérer la fixture
pnpm fixture:abattoirs

# 4. Inspecter le diff git pour voir les combinaisons qui ont changé
git diff tests/fixtures/abattoirs/oracle-2744.json

# 5. Lancer les tests : ceux qui échouent indiquent les règles à mettre à jour
pnpm test

# 6. Adapter les règles dans src/engine/abattoirs/*.ts

# 7. Commit unique : xlsx + JSON + code
```

## Garantie anti-dérive

`pnpm fixture:abattoirs:check` (intégré dans `pnpm validate`) vérifie que le JSON committé correspond bien au xlsx source. Si vous modifiez le xlsx sans régénérer le JSON, la CI échoue.

## Si la structure du xlsx change

Le script échoue avec un message explicite (en-têtes inattendus, valeurs inconnues dans une colonne, etc.). Dans ce cas, c'est un changement de modèle métier : il faut adapter à la fois le script, les types `src/engine/types.ts`, les schémas Zod, les règles, et probablement l'UI.
