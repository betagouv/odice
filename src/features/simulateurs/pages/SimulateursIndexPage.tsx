// Point d'entrée unique des simulateurs.
// Layout : fond bleu DSFR full-width, carte grise (sélecteur de type + formulaire),
// puis panneau de résultats (carte à liseré bleu) après une soumission valide.
// Les deux simulateurs (Abattoirs, Autres Établissements) sont gérés symétriquement.

import { useEffect, useRef, useState } from "react";
import {
  evaluateAbattoir,
  evaluateEtablissements,
  type AbattoirsInputs,
  type AbattoirsOutputs,
  type EtablissementsInputs,
  type EtablissementsOutputs,
} from "@engine";
import { AvertissementNotice } from "@shared/components/AvertissementNotice";
import { PageTitle } from "@shared/components/PageTitle";
import {
  useMatomo,
  matomoAction,
  MATOMO_SIMULATEURS,
  MATOMO_STEPS,
  serialiseCombinaisonAbattoirs,
  serialiseCombinaisonEtablissements,
} from "@shared/analytics";
import { AbattoirsForm } from "../abattoirs/components/AbattoirsForm";
import { AbattoirsResult } from "../abattoirs/components/AbattoirsResult";
import { EtablissementsForm } from "../etablissements/components/EtablissementsForm";
import { EtablissementsResult } from "../etablissements/components/EtablissementsResult";
import { TYPE_ETABLISSEMENT_OPTIONS, familleFor } from "./typeEtablissement";

export function SimulateursIndexPage() {
  const [type, setType] = useState<string>("");
  const famille = familleFor(type);
  const [abattoirsResult, setAbattoirsResult] = useState<AbattoirsOutputs | null>(null);
  const [etablissementsResult, setEtablissementsResult] = useState<EtablissementsOutputs | null>(
    null,
  );
  const resultRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useMatomo();

  // Scroll vers le panneau de résultats à chaque nouvelle évaluation.
  useEffect(() => {
    if ((abattoirsResult !== null || etablissementsResult !== null) && resultRef.current !== null) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [abattoirsResult, etablissementsResult]);

  function handleAbattoirsSubmit(inputs: AbattoirsInputs) {
    trackEvent(matomoAction(MATOMO_SIMULATEURS.ABATTOIRS, MATOMO_STEPS.LANCEE));
    trackEvent(matomoAction(MATOMO_SIMULATEURS.ABATTOIRS, MATOMO_STEPS.COMBINAISON), {
      name: serialiseCombinaisonAbattoirs(inputs),
    });
    setAbattoirsResult(evaluateAbattoir(inputs));
    trackEvent(matomoAction(MATOMO_SIMULATEURS.ABATTOIRS, MATOMO_STEPS.RESULTAT));
  }

  function handleEtablissementsSubmit(inputs: EtablissementsInputs) {
    trackEvent(matomoAction(MATOMO_SIMULATEURS.ETABLISSEMENTS, MATOMO_STEPS.LANCEE));
    trackEvent(matomoAction(MATOMO_SIMULATEURS.ETABLISSEMENTS, MATOMO_STEPS.COMBINAISON), {
      name: serialiseCombinaisonEtablissements(inputs),
    });
    setEtablissementsResult(evaluateEtablissements(inputs));
    trackEvent(matomoAction(MATOMO_SIMULATEURS.ETABLISSEMENTS, MATOMO_STEPS.RESULTAT));
  }

  function resetResults() {
    setAbattoirsResult(null);
    setEtablissementsResult(null);
  }

  // Réinitialisation explicite (bouton du formulaire), distincte des resets implicites (saisie).
  function handleReset() {
    resetResults();
    if (famille !== null) trackEvent(matomoAction(famille, MATOMO_STEPS.REINITIALISATION));
  }

  function handleTypeChange(value: string) {
    setType(value);
    resetResults();
    const familleChoisie = familleFor(value);
    if (familleChoisie !== null) trackEvent(matomoAction(familleChoisie, MATOMO_STEPS.OUVERT));
  }

  return (
    <>
      <PageTitle>Simulateur</PageTitle>
      <div className="fr-background-alt--blue-france fr-py-6w">
        <div className="fr-container fr-mb-4w">
          <div className="fr-background-default--grey fr-p-6w">
            <div className="fr-grid-row">
              <div className="fr-col-12 fr-col-md-6">
                <h1 className="fr-h3 fr-mb-2w">Votre situation</h1>

                <div className="fr-select-group fr-mb-0">
                  <label className="fr-label" htmlFor="type-etablissement">
                    Type d'établissement d'origine du mouvement des viandes
                    <span className="fr-hint-text">
                      Les viandes fraîches y compris sang et viscères, les viandes hachées, les
                      préparations de viandes, les produits à base de viande, les viandes séparées
                      mécaniquement et les produits contenant des viandes.
                    </span>
                  </label>
                  <select
                    className="fr-select"
                    id="type-etablissement"
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Sélectionner un type d'établissement
                    </option>
                    {TYPE_ETABLISSEMENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {famille === "abattoir" && (
              <div className="fr-mt-8w">
                <AbattoirsForm
                  onSubmit={handleAbattoirsSubmit}
                  onReset={handleReset}
                  onChange={resetResults}
                />
              </div>
            )}

            {famille === "autre" && (
              <div className="fr-mt-8w">
                <EtablissementsForm
                  onSubmit={handleEtablissementsSubmit}
                  onReset={handleReset}
                  onChange={resetResults}
                />
              </div>
            )}
          </div>

          {famille === "abattoir" && abattoirsResult !== null && (
            <div
              ref={resultRef}
              className="fr-background-default--grey fr-p-6w fr-mt-4w border-8 border-[color:var(--border-plain-blue-france)]"
            >
              <AbattoirsResult result={abattoirsResult} />
            </div>
          )}

          {famille === "autre" && etablissementsResult !== null && (
            <div
              ref={resultRef}
              className="fr-background-default--grey fr-p-6w fr-mt-4w border-8 border-[color:var(--border-plain-blue-france)]"
            >
              <EtablissementsResult result={etablissementsResult} />
            </div>
          )}
        </div>
      </div>

      <AvertissementNotice />
    </>
  );
}
