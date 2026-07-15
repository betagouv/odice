// Formulaire de saisie du simulateur Abattoirs.
// Affichage progressif : un seul champ au départ, chaque saisie révèle le suivant.
// Layout : pleine largeur, fieldsets en 2 colonnes, HR entre les blocs (cf. maquette).

import { useMemo, useState, type FormEvent } from "react";
import { Statut, Zone, type AbattoirsInputs } from "@engine";
import {
  STATUT_LABELS,
  STATUT_ORDER,
  ZONE_LABELS,
  ZONE_ORDER,
  isStatutApplicable,
} from "@shared/labels/abattoirs.labels";
import { CarteZonesHint } from "@shared/components/CarteZonesHint";
import { DocumentAnimauxHint } from "@shared/components/DocumentAnimauxHint";
import {
  useProgressiveFields,
  type ProgressiveFieldConfig,
} from "@shared/hooks/useProgressiveFields";

type FormState = {
  zoneSuides: Zone | "";
  statut: Statut | "";
  zoneAbattoir: Zone | "";
  mcaAbattoir: "oui" | "non" | "";
  zoneEtbDestinataire: Zone | "";
  mcaEtbDestinataire: "oui" | "non" | "";
};

const EMPTY_FORM: FormState = {
  zoneSuides: "",
  statut: "",
  zoneAbattoir: "",
  mcaAbattoir: "",
  zoneEtbDestinataire: "",
  mcaEtbDestinataire: "",
};

// Séquence de révélation. Le statut ne s'insère que pour les zones ZRII/ZRIII.
const FIELDS: ProgressiveFieldConfig<FormState>[] = [
  { key: "zoneSuides" },
  {
    key: "statut",
    isApplicable: (f) => isStatutApplicable(f.zoneSuides === "" ? null : f.zoneSuides),
  },
  { key: "zoneAbattoir" },
  { key: "mcaAbattoir" },
  { key: "zoneEtbDestinataire" },
  { key: "mcaEtbDestinataire" },
];

type Props = {
  onSubmit: (inputs: AbattoirsInputs) => void;
  onReset: () => void;
  onChange?: () => void;
  // Premier renseignement de la zone d'origine des suidés (démarrage du chrono de saisie).
  onStart?: () => void;
};

export function AbattoirsForm({ onSubmit, onReset, onChange, onStart }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const { isVisible, advance, revealAll } = useProgressiveFields(FIELDS, EMPTY_FORM);

  // Statut requis (= bloque la validation) uniquement pour ZRII/ZRIII.
  const statutRequired = useMemo(
    () => isStatutApplicable(form.zoneSuides === "" ? null : form.zoneSuides),
    [form.zoneSuides],
  );

  const canSubmit =
    form.zoneSuides !== "" &&
    form.zoneAbattoir !== "" &&
    form.mcaAbattoir !== "" &&
    form.zoneEtbDestinataire !== "" &&
    form.mcaEtbDestinataire !== "" &&
    (!statutRequired || form.statut !== "");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (key === "zoneSuides" && value !== "") onStart?.();
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
      statut: statutRequired && form.statut !== "" ? (form.statut as Statut) : null,
      zoneAbattoir: form.zoneAbattoir as Zone,
      mcaAbattoir: form.mcaAbattoir === "oui",
      zoneEtbDestinataire: form.zoneEtbDestinataire as Zone,
      mcaEtbDestinataire: form.mcaEtbDestinataire === "oui",
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
      <h3 className="fr-h5 fr-mb-2w">
        Mouvement abattoir &gt; autre établissement du secteur alimentaire
      </h3>
      <hr />

      <section className="fr-mb-3w">
        <h4 className="fr-h6 fr-mb-2w flex items-center gap-2">
          <img
            src="/icons/cochon.png"
            alt=""
            aria-hidden="true"
            className="h-6 w-5 shrink-0 object-contain"
          />
          <span>Informations à la réception des suidés</span>
        </h4>

        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
          {isVisible("zoneSuides", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="zone-suides">
                  Zone d'origine des suidés dont sont issues les viandes
                  <DocumentAnimauxHint />
                </label>
                <select
                  className="fr-select"
                  id="zone-suides"
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

          {isVisible("statut", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="statut">
                  Statut réglementaire du mouvement des animaux
                  <DocumentAnimauxHint />
                </label>
                <select
                  className="fr-select"
                  id="statut"
                  required
                  value={form.statut}
                  onChange={(e) => update("statut", e.target.value as Statut | "")}
                >
                  <option value="" disabled>
                    Sélectionner une option
                  </option>
                  {STATUT_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUT_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {isVisible("zoneAbattoir", form) && (
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
              <span>Informations sur votre abattoir</span>
            </h4>

            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="zone-abattoir">
                    Zone dans laquelle est localisé votre abattoir
                    <CarteZonesHint />
                  </label>
                  <select
                    className="fr-select"
                    id="zone-abattoir"
                    required
                    value={form.zoneAbattoir}
                    onChange={(e) => update("zoneAbattoir", e.target.value as Zone | "")}
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

              {isVisible("mcaAbattoir", form) && (
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="mca-abattoir">
                      Votre abattoir est-il en possession d'un agrément zoosanitaire MCA ?
                    </label>
                    <select
                      className="fr-select"
                      id="mca-abattoir"
                      required
                      value={form.mcaAbattoir}
                      onChange={(e) => update("mcaAbattoir", e.target.value as "oui" | "non" | "")}
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

      {isVisible("zoneEtbDestinataire", form) && (
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
                  <label className="fr-label" htmlFor="zone-dest">
                    Zone dans laquelle est localisé l'établissement destinataire des viandes
                    <CarteZonesHint />
                  </label>
                  <select
                    className="fr-select"
                    id="zone-dest"
                    required
                    value={form.zoneEtbDestinataire}
                    onChange={(e) => update("zoneEtbDestinataire", e.target.value as Zone | "")}
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

              {isVisible("mcaEtbDestinataire", form) && (
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="mca-dest">
                      L'établissement destinataire est-il en possession d'un agrément zoosanitaire
                      MCA ?
                    </label>
                    <select
                      className="fr-select"
                      id="mca-dest"
                      required
                      value={form.mcaEtbDestinataire}
                      onChange={(e) =>
                        update("mcaEtbDestinataire", e.target.value as "oui" | "non" | "")
                      }
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
