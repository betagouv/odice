// Formulaire de saisie du simulateur Autres Établissements.
// Affichage progressif : un seul champ au départ, chaque saisie révèle le suivant.
// 9 entrées groupées en 3 fieldsets (réception / expéditeur-process / destination).

import { useState, type FormEvent } from "react";
import { Marque, Zone, type EtablissementsInputs } from "@engine";
import {
  MARQUE_LABELS,
  MARQUE_ORDER,
  ZONE_LABELS,
  ZONE_ORDER,
} from "@shared/labels/etablissements.labels";
import {
  useProgressiveFields,
  type ProgressiveFieldConfig,
} from "@shared/hooks/useProgressiveFields";
import { CarteZonesHint } from "@shared/components/CarteZonesHint";

type OuiNon = "oui" | "non" | "";

type FormState = {
  zoneSuides: Zone | "";
  marqueViandes: Marque | "";
  traitementObligatoireFr: OuiNon;
  traitementObligatoireUe: OuiNon;
  zoneExpediteur: Zone | "";
  mcaExpediteur: OuiNon;
  traitementRealise: OuiNon;
  zoneDestinataire: Zone | "";
  mcaDestinataire: OuiNon;
};

const EMPTY_FORM: FormState = {
  zoneSuides: "",
  marqueViandes: "",
  traitementObligatoireFr: "",
  traitementObligatoireUe: "",
  zoneExpediteur: "",
  mcaExpediteur: "",
  traitementRealise: "",
  zoneDestinataire: "",
  mcaDestinataire: "",
};

// Séquence de révélation des 9 champs (aucun conditionnel métier ici).
const FIELDS: ProgressiveFieldConfig<FormState>[] = [
  { key: "zoneSuides" },
  { key: "marqueViandes" },
  { key: "traitementObligatoireFr" },
  { key: "traitementObligatoireUe" },
  { key: "zoneExpediteur" },
  { key: "mcaExpediteur" },
  { key: "traitementRealise" },
  { key: "zoneDestinataire" },
  { key: "mcaDestinataire" },
];

type Props = {
  onSubmit: (inputs: EtablissementsInputs) => void;
  onReset: () => void;
  onChange?: () => void;
};

export function EtablissementsForm({ onSubmit, onReset, onChange }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const { isVisible, advance, revealAll } = useProgressiveFields(FIELDS, EMPTY_FORM);

  const canSubmit = Object.values(form).every((v) => v !== "");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    const next = { ...form, [key]: value };
    setForm(next);
    advance(next);
    onChange?.();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      zoneSuides: form.zoneSuides as Zone,
      marqueViandes: form.marqueViandes as Marque,
      traitementObligatoireFr: form.traitementObligatoireFr === "oui",
      traitementObligatoireUe: form.traitementObligatoireUe === "oui",
      zoneExpediteur: form.zoneExpediteur as Zone,
      mcaExpediteur: form.mcaExpediteur === "oui",
      traitementRealise: form.traitementRealise === "oui",
      zoneDestinataire: form.zoneDestinataire as Zone,
      mcaDestinataire: form.mcaDestinataire === "oui",
    });
  }

  // Réinitialiser : on vide les valeurs mais on garde tous les champs visibles.
  function handleReset() {
    setForm(EMPTY_FORM);
    revealAll();
    onReset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="fr-h5 fr-mb-2w">Mouvement entre établissements du secteur alimentaire</h3>
      <hr />

      <section className="fr-mb-3w">
        <h4 className="fr-h6 fr-mb-2w flex items-center gap-2">
          <img
            src="/icons/cochon.png"
            alt=""
            aria-hidden="true"
            className="h-6 w-5 shrink-0 object-contain"
          />
          <span>Informations à la réception des viandes</span>
        </h4>

        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
          {isVisible("zoneSuides", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="etb-zone-suides">
                  Zone d'origine des suidés dont sont issues les viandes
                </label>
                <select
                  className="fr-select"
                  id="etb-zone-suides"
                  required
                  value={form.zoneSuides}
                  onChange={(e) => update("zoneSuides", e.target.value as Zone | "")}
                >
                  <option value="" disabled>
                    Sélectionner une option
                  </option>
                  {ZONE_ORDER.map((z) => (
                    <option key={z} value={z}>
                      {ZONE_LABELS[z]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {isVisible("marqueViandes", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="etb-marque-viandes">
                  Marque sanitaire apposée sur les viandes reçues
                </label>
                <select
                  className="fr-select"
                  id="etb-marque-viandes"
                  required
                  value={form.marqueViandes}
                  onChange={(e) => update("marqueViandes", e.target.value as Marque | "")}
                >
                  <option value="" disabled>
                    Sélectionner une option
                  </option>
                  {MARQUE_ORDER.map((m) => (
                    <option key={m} value={m}>
                      {MARQUE_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {isVisible("traitementObligatoireFr", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="etb-trait-oblig-fr">
                  Un traitement d'atténuation est-il obligatoire pour les mouvements nationaux ?
                </label>
                <select
                  className="fr-select"
                  id="etb-trait-oblig-fr"
                  required
                  value={form.traitementObligatoireFr}
                  onChange={(e) => update("traitementObligatoireFr", e.target.value as OuiNon)}
                >
                  <option value="" disabled>
                    Sélectionner une option
                  </option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
            </div>
          )}

          {isVisible("traitementObligatoireUe", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="etb-trait-oblig-ue">
                  Un traitement d'atténuation est-il obligatoire pour les échanges UE ?
                </label>
                <select
                  className="fr-select"
                  id="etb-trait-oblig-ue"
                  required
                  value={form.traitementObligatoireUe}
                  onChange={(e) => update("traitementObligatoireUe", e.target.value as OuiNon)}
                >
                  <option value="" disabled>
                    Sélectionner une option
                  </option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {isVisible("zoneExpediteur", form) && (
        <>
          <hr />

          <section className="fr-mb-3w">
            <h4 className="fr-h6 fr-mb-2w flex items-center gap-2">
              <img
                src="/icons/building.png"
                alt=""
                aria-hidden="true"
                className="h-6 w-6 shrink-0"
              />
              <span>Informations sur l'établissement expéditeur</span>
            </h4>

            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="etb-zone-exp">
                    Zone dans laquelle est localisé l'établissement expéditeur
                    <CarteZonesHint />
                  </label>
                  <select
                    className="fr-select"
                    id="etb-zone-exp"
                    required
                    value={form.zoneExpediteur}
                    onChange={(e) => update("zoneExpediteur", e.target.value as Zone | "")}
                  >
                    <option value="" disabled>
                      Sélectionner une option
                    </option>
                    {ZONE_ORDER.map((z) => (
                      <option key={z} value={z}>
                        {ZONE_LABELS[z]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isVisible("mcaExpediteur", form) && (
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="etb-mca-exp">
                      L'établissement expéditeur est-il en possession d'un agrément zoosanitaire MCA
                      ?
                    </label>
                    <select
                      className="fr-select"
                      id="etb-mca-exp"
                      required
                      value={form.mcaExpediteur}
                      onChange={(e) => update("mcaExpediteur", e.target.value as OuiNon)}
                    >
                      <option value="" disabled>
                        Sélectionner une option
                      </option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                </div>
              )}

              {isVisible("traitementRealise", form) && (
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="etb-trait-realise">
                      Un traitement d'atténuation a-t-il été réalisé ?
                    </label>
                    <select
                      className="fr-select"
                      id="etb-trait-realise"
                      required
                      value={form.traitementRealise}
                      onChange={(e) => update("traitementRealise", e.target.value as OuiNon)}
                    >
                      <option value="" disabled>
                        Sélectionner une option
                      </option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {isVisible("zoneDestinataire", form) && (
        <>
          <hr />

          <section className="fr-mb-3w">
            <h4 className="fr-h6 fr-mb-2w flex items-center gap-2">
              <img src="/icons/truck.png" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
              <span>Informations sur l'établissement destinataire des viandes</span>
            </h4>

            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="etb-zone-dest">
                    Zone dans laquelle est localisé l'établissement destinataire des viandes
                    <CarteZonesHint />
                  </label>
                  <select
                    className="fr-select"
                    id="etb-zone-dest"
                    required
                    value={form.zoneDestinataire}
                    onChange={(e) => update("zoneDestinataire", e.target.value as Zone | "")}
                  >
                    <option value="" disabled>
                      Sélectionner une option
                    </option>
                    {ZONE_ORDER.map((z) => (
                      <option key={z} value={z}>
                        {ZONE_LABELS[z]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isVisible("mcaDestinataire", form) && (
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="etb-mca-dest">
                      L'établissement destinataire est-il en possession d'un agrément zoosanitaire
                      MCA ?
                    </label>
                    <select
                      className="fr-select"
                      id="etb-mca-dest"
                      required
                      value={form.mcaDestinataire}
                      onChange={(e) => update("mcaDestinataire", e.target.value as OuiNon)}
                    >
                      <option value="" disabled>
                        Sélectionner une option
                      </option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <ul className="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
        <li>
          <button type="submit" className="fr-btn" disabled={!canSubmit}>
            Valider
          </button>
        </li>
        <li>
          <button type="button" className="fr-btn fr-btn--secondary" onClick={handleReset}>
            Réinitialiser
          </button>
        </li>
      </ul>
    </form>
  );
}
