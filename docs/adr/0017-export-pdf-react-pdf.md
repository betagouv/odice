# ADR-0017 : Export PDF des simulations avec @react-pdf/renderer

**Date** : 2026-10-06
**Statut** : Accepté

## Contexte

La maquette du panneau de résultats ajoute un bouton « Exporter la simulation » qui produit un document PDF : bloc-marque, saisies de l'utilisateur, conditions de mouvement (mêmes badges que l'écran), mention DDecPP et lien vers le site. Odicé est une SPA statique sans backend : le PDF doit être généré dans le navigateur.

## Décision

> Nous générons un vrai fichier PDF dans le navigateur avec `@react-pdf/renderer`, chargé dynamiquement au premier clic sur « Exporter la simulation ».

- Modèle pur [`simulationExport.ts`](../../src/features/simulateurs/export/simulationExport.ts) (saisies, badges, textes), testé sans rendu PDF.
- Badges partagés avec le panneau web via [`resultatBadges.ts`](../../src/features/simulateurs/components/resultatBadges.ts) : mêmes libellés, couleurs et masquage.
- Rendu [`SimulationPdf.tsx`](../../src/features/simulateurs/export/SimulationPdf.tsx) : police Marianne du DSFR, couleurs des jetons DSFR, bloc-marque officiel rasterisé depuis le rendu DSFR (`public/images/pdf/bloc-marque.png`, react-pdf ne gérant pas les SVG en image).
- [`telechargerPdf.tsx`](../../src/features/simulateurs/export/telechargerPdf.tsx) importe react-pdf dynamiquement : le paquet (~445 ko gzip) forme un chunk séparé, absent du chargement initial.
- Fichier `odice-simulation-AAAA-MM-JJ.pdf` ; event Matomo `*_simulation_exportee`.

## Options envisagées

### Option A — @react-pdf/renderer, chargé à la demande (retenue)

- Avantages : téléchargement direct d'un PDF vectoriel fidèle à la maquette, indépendant du navigateur ; composants React déclaratifs ; aucun coût au chargement initial.
- Inconvénients : dépendance volumineuse (chunk dédié) ; mise en page à maintenir en parallèle du panneau web (atténué par les badges partagés).

### Option B — Impression navigateur (`window.print` + feuille de style d'impression)

- Avantages : aucune dépendance, réutilise le DSFR (`dsfr.print.css`).
- Inconvénients : passe par la boîte de dialogue d'impression (« Enregistrer en PDF ») ; rendu variable selon le navigateur ; mise en page de la maquette difficile à garantir.

### Option C — Capture HTML en image (html2canvas + jsPDF)

- Avantages : réutilise le rendu web tel quel.
- Inconvénients : PDF rasterisé (texte non sélectionnable, inaccessible, flou à l'impression).

## Conséquences

### Positives

- L'utilisateur conserve et transmet un document fidèle aux résultats affichés.
- Libellés et règles de masquage garantis identiques entre écran et PDF.

### Négatives / Risques

- Chunk react-pdf de ~1,2 Mo (445 ko gzip) téléchargé au premier export ; « Export en cours… » affiché pendant la génération.
- Les réponses aux questions de traitement (Autres établissements) ne sont pas reprises, car souvent déduites ([ADR-0016](./0016-autres-etablissements-valeurs-deduites.md)).
- Le bandeau « Mentions à reporter » n'apparaît pas dans le PDF (absent de la maquette).

## Liens

- Composants : [`ExportSimulationButton.tsx`](../../src/features/simulateurs/export/ExportSimulationButton.tsx), [`SimulationResult.tsx`](../../src/features/simulateurs/components/SimulationResult.tsx)
- Tests : [`simulationExport.spec.ts`](../../src/features/simulateurs/export/simulationExport.spec.ts), [`export-simulation.spec.ts`](../../tests/e2e/export-simulation.spec.ts)
- ADR liés : [ADR-0015](./0015-panneau-resultats-commun-et-masquage.md), [ADR-0016](./0016-autres-etablissements-valeurs-deduites.md)
