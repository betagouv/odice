export function SimulateursIndexPage() {
  // TODO: brancher le formulaire sur le moteur de règles (src/engine/) et gérer la navigation
  // vers le résultat. Pour l'instant la liste d'options et le bouton sont des placeholders.
  return (
    <div style={{ backgroundColor: "var(--background-alt-blue-france)" }} className="fr-py-6w">
      <div className="fr-container">
        <div
          className="fr-p-6w fr-mt-4w"
          style={{ backgroundColor: "var(--background-default-grey)" }}
        >
          <h1 className="fr-h2">Votre situation</h1>

          <div className="fr-select-group fr-mt-4w">
            <label className="fr-label" htmlFor="type-etablissement">
              Type d'établissement d'origine du mouvement des viandes
              <span className="fr-hint-text">
                On considère ici les viandes fraîches y compris sang et viscères, les viandes
                hachées, les préparations de viandes, les produits à base de viande, les viandes
                séparées mécaniquement et les produits contenant des viandes.
              </span>
            </label>
            <select
              className="fr-select"
              id="type-etablissement"
              name="type-etablissement"
              defaultValue=""
            >
              <option value="" disabled hidden>
                Sélectionner un type d'établissement
              </option>
              {/* TODO: remplacer par la vraie liste réglementaire des types d'établissement */}
              <option value="abattoir">Abattoir</option>
              <option value="decoupe">Autre</option>
            </select>
          </div>

          <button type="button" className="fr-btn fr-mt-4w">
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}
