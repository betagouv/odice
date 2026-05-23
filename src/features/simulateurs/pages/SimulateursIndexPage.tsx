// Point d'entrée unique des simulateurs.
// Layout : fond bleu DSFR full-width derrière, carte grise pleine largeur du container,
// contenu (titre + form) constraint à 50 % à gauche. Panneau de résultats en bas,
// uniquement après une soumission valide ; scroll auto vers le panneau.

import { useEffect, useRef, useState } from "react";
import { evaluateAbattoir, type AbattoirsInputs, type AbattoirsOutputs } from "@engine";
import { Notice } from "@shared/components/Notice";
import { AbattoirsForm } from "../abattoirs/components/AbattoirsForm";
import { AbattoirsResult } from "../abattoirs/components/AbattoirsResult";
import { EtablissementsSimulator } from "../etablissements/components/EtablissementsSimulator";

type TypeEtablissement = "" | "abattoir" | "autre";

export function SimulateursIndexPage() {
  const [type, setType] = useState<TypeEtablissement>("");
  const [abattoirsResult, setAbattoirsResult] = useState<AbattoirsOutputs | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll vers le panneau de résultats à chaque nouvelle évaluation.
  useEffect(() => {
    if (abattoirsResult !== null && resultRef.current !== null) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [abattoirsResult]);

  function handleAbattoirsSubmit(inputs: AbattoirsInputs) {
    setAbattoirsResult(evaluateAbattoir(inputs));
  }

  function handleAbattoirsReset() {
    setAbattoirsResult(null);
  }

  function handleTypeChange(value: TypeEtablissement) {
    setType(value);
    setAbattoirsResult(null);
  }

  return (
    <>
      <div className="fr-background-alt--blue-france fr-py-6w">
        <div className="fr-container">
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
                    onChange={(e) => handleTypeChange(e.target.value as TypeEtablissement)}
                  >
                    <option value="" disabled>
                      Sélectionner un type d'établissement
                    </option>
                    <option value="abattoir">Abattoir</option>
                    <option value="autre">Autre établissement du secteur alimentaire</option>
                  </select>
                </div>
              </div>
            </div>

            {type === "abattoir" && (
              <div className="fr-mt-8w">
                <AbattoirsForm
                  onSubmit={handleAbattoirsSubmit}
                  onReset={handleAbattoirsReset}
                  onChange={handleAbattoirsReset}
                />
              </div>
            )}
          </div>

          {type === "autre" && <EtablissementsSimulator />}

          {type === "abattoir" && (
            <div
              ref={resultRef}
              className="fr-background-default--grey fr-p-6w fr-mt-4w border-8 border-[color:var(--border-plain-blue-france)]"
            >
              <AbattoirsResult result={abattoirsResult} />
            </div>
          )}
        </div>
      </div>

      <Notice title="Avertissement" variant="warning">
        Cet outil est une aide à la décision fournie <strong>à titre indicatif</strong> et ne peut
        en aucun cas se substituer à la consultation des textes réglementaires en vigueur. Malgré
        nos efforts pour assurer l'exactitude des informations, leur exhaustivité et leur mise à
        jour ne peuvent être garanties.{" "}
        <strong>
          Il appartient à l'utilisateur de vérifier la conformité des résultats obtenus avant toute
          prise de décision.
        </strong>{" "}
        En conséquence, nous déclinons toute responsabilité en cas d'erreur, d'omission ou
        d'interprétation incorrecte des informations fournies par cet outil.
      </Notice>
    </>
  );
}
