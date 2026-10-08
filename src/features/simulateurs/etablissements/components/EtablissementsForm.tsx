// Formulaire de saisie du simulateur Autres Établissements.
// Affichage progressif par section : chaque partie s'affiche une fois la précédente complète.
// Layout : votre établissement, puis 1. provenance et 2. destination (cf. maquette).

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Marque, type EtablissementsInputs } from "@engine";
import {
  MARQUE_LABELS,
  MARQUE_ORDER,
  PERIMETRE_VIANDES,
  ZONE_OPTIONS_AVEC_REFLEXE,
  zoneMoteur,
  type ZoneChoix,
} from "@shared/labels/etablissements.labels";
import {
  useProgressiveFields,
  type ProgressiveFieldConfig,
} from "@shared/hooks/useProgressiveFields";
import { ROUTES } from "@shared/config/routes.config";
import { CarteZonesHint } from "@shared/components/CarteZonesHint";
import { McaInfoTooltip } from "@shared/components/McaInfoTooltip";
import { SituationImpossibleAlert } from "@shared/components/SituationImpossibleAlert";
import {
  MESSAGES_SITUATION_IMPOSSIBLE,
  deduireTraitements,
  questionTraitementNationalVisible,
  questionTraitementRealiseVisible,
  situationImpossible,
  zoneOuNull,
  type OuiNon,
} from "./traitementRegles";

// Situation impossible (spec) : bloque les questions de traitement, la destination et la validation.
const impossible = (f: { zoneSuides: ZoneChoix | ""; marqueViandes: Marque | "" }) =>
  situationImpossible(
    f.zoneSuides === "" ? null : f.zoneSuides,
    f.marqueViandes === "" ? null : f.marqueViandes,
  );

type FormState = {
  zoneExpediteur: ZoneChoix | "";
  mcaExpediteur: OuiNon;
  zoneSuides: ZoneChoix | "";
  marqueViandes: Marque | "";
  traitementObligatoireFr: OuiNon;
  traitementRealise: OuiNon;
  zoneDestinataire: ZoneChoix | "";
  mcaDestinataire: OuiNon;
};

const EMPTY_FORM: FormState = {
  zoneExpediteur: "",
  mcaExpediteur: "",
  zoneSuides: "",
  marqueViandes: "",
  traitementObligatoireFr: "",
  traitementRealise: "",
  zoneDestinataire: "",
  mcaDestinataire: "",
};

const marqueOuNull = (marque: Marque | ""): Marque | null => (marque === "" ? null : marque);

// Révélation par section (spec) : votre établissement, provenance, destination.
// Questions de traitement affichées seulement quand la réponse n'est pas connue
// d'avance ; sinon valeur déduite (cf. traitementRegles.ts).
const FIELDS: ProgressiveFieldConfig<FormState>[] = [
  { key: "zoneExpediteur", section: "etablissement" },
  { key: "mcaExpediteur", section: "etablissement" },
  { key: "zoneSuides", section: "provenance" },
  { key: "marqueViandes", section: "provenance" },
  {
    key: "traitementObligatoireFr",
    section: "provenance",
    isApplicable: (f) =>
      impossible(f) === null &&
      questionTraitementNationalVisible(zoneOuNull(f.zoneSuides), marqueOuNull(f.marqueViandes)),
  },
  {
    key: "traitementRealise",
    section: "provenance",
    isApplicable: (f) =>
      impossible(f) === null &&
      questionTraitementRealiseVisible(
        zoneOuNull(f.zoneSuides),
        marqueOuNull(f.marqueViandes),
        f.traitementObligatoireFr,
      ),
  },
  { key: "zoneDestinataire", section: "destination" },
  { key: "mcaDestinataire", section: "destination" },
];

type Props = {
  // Nom du type sélectionné (« atelier de découpe »…), repris dans les libellés.
  nomEtablissement: string;
  onSubmit: (inputs: EtablissementsInputs) => void;
  onReset: () => void;
  onChange?: () => void;
  // Premier renseignement de la zone de l'établissement (démarrage du chrono de saisie).
  onStart?: () => void;
};

export function EtablissementsForm({
  nomEtablissement,
  onSubmit,
  onReset,
  onChange,
  onStart,
}: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const { isVisible, advance, revealAll } = useProgressiveFields(FIELDS, EMPTY_FORM);

  // Ne pas exiger les champs masqués (restés "") : seuls les champs applicables comptent.
  const situation = impossible(form);
  const canSubmit =
    situation === null &&
    FIELDS.every((field) => {
      const applicable = field.isApplicable ? field.isApplicable(form) : true;
      return !applicable || form[field.key] !== "";
    });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (key === "zoneExpediteur" && value !== "") onStart?.();
    const next = { ...form, [key]: value };
    setForm(next);
    advance(next);
    onChange?.();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    const zoneSuides = zoneMoteur(form.zoneSuides as ZoneChoix);
    const traitements = deduireTraitements(
      zoneSuides,
      form.marqueViandes as Marque,
      form.traitementObligatoireFr,
      form.traitementRealise,
    );
    onSubmit({
      zoneSuides,
      marqueViandes: form.marqueViandes as Marque,
      traitementObligatoireFr: traitements.fr,
      traitementObligatoireUe: traitements.ue,
      zoneExpediteur: zoneMoteur(form.zoneExpediteur as ZoneChoix),
      mcaExpediteur: form.mcaExpediteur === "oui",
      traitementRealise: traitements.realise,
      zoneDestinataire: zoneMoteur(form.zoneDestinataire as ZoneChoix),
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
      <section className="fr-mb-3w">
        <h2 className="fr-h6 fr-mb-2w flex items-center gap-2">
          <img src="/icons/building.png" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
          <span>Informations sur votre {nomEtablissement}</span>
        </h2>

        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="etb-zone-exp">
                Zone de votre {nomEtablissement}.
                <CarteZonesHint />
              </label>
              <select
                className="fr-select"
                id="etb-zone-exp"
                required
                value={form.zoneExpediteur}
                onChange={(e) => update("zoneExpediteur", e.target.value as ZoneChoix | "")}
              >
                <option value="" disabled>
                  Sélectionner une option
                </option>
                {ZONE_OPTIONS_AVEC_REFLEXE.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isVisible("mcaExpediteur", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="etb-mca-exp">
                  Êtes-vous en possession d'un agrément zoosanitaire MCA ?
                  <McaInfoTooltip />
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
        </div>
      </section>

      {isVisible("zoneSuides", form) && (
        <>
          <h2 className="fr-h5 fr-mt-6w fr-mb-2w">1. Provenance de la matière première</h2>
          <hr />
          <p className="fr-text--xs">
            {PERIMETRE_VIANDES}{" "}
            <strong>
              Si vous avez un produit composé d'un mélange de viandes de porc issues de zones
              différentes, {/* Nouvel onglet : ne pas perdre la saisie en cours. */}
              <Link to={ROUTES.NIVEAU_RISQUE} target="_blank" rel="noopener noreferrer">
                référez-vous à ce tableau
              </Link>
              .
            </strong>
          </p>

          <section className="fr-mb-3w">
            <h3 className="fr-h6 fr-mb-2w flex items-center gap-2">
              <img
                src="/icons/cochon.png"
                alt=""
                aria-hidden="true"
                className="h-6 w-5 shrink-0 object-contain"
              />
              <span>Informations sur l'établissement d'élevage</span>
            </h3>

            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="etb-zone-suides">
                    Zone d'origine des porcs dont sont issues les viandes.
                    <span className="fr-hint-text">Visible sur le bon de livraison</span>
                  </label>
                  <select
                    className="fr-select"
                    id="etb-zone-suides"
                    required
                    value={form.zoneSuides}
                    onChange={(e) => update("zoneSuides", e.target.value as ZoneChoix | "")}
                  >
                    <option value="" disabled>
                      Sélectionner une option
                    </option>
                    {ZONE_OPTIONS_AVEC_REFLEXE.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {isVisible("marqueViandes", form) && (
            <section className="fr-mb-3w">
              <h3 className="fr-h6 fr-mb-2w flex items-center gap-2">
                <img
                  src="/icons/viande.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 object-contain"
                />
                <span>Informations sur les viandes</span>
              </h3>

              <fieldset className="fr-fieldset" aria-labelledby="etb-marque-viandes-legend">
                <legend
                  className="fr-fieldset__legend fr-fieldset__legend--regular"
                  id="etb-marque-viandes-legend"
                >
                  Marque sanitaire présente sur les viandes à réception.
                </legend>
                {MARQUE_ORDER.map((m) => (
                  <div key={m} className="fr-fieldset__element fr-fieldset__element--inline">
                    <div className="fr-radio-group fr-radio-rich">
                      <input
                        type="radio"
                        id={`etb-marque-${m}`}
                        name="etb-marque-viandes"
                        value={m}
                        required
                        checked={form.marqueViandes === m}
                        onChange={() => update("marqueViandes", m)}
                      />
                      <label className="fr-label" htmlFor={`etb-marque-${m}`}>
                        {MARQUE_LABELS[m]}
                      </label>
                      <div className="fr-radio-rich__pictogram">
                        <img src={`/images/marques/${m}.png`} alt="" />
                      </div>
                    </div>
                  </div>
                ))}
              </fieldset>

              <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
                {isVisible("traitementObligatoireFr", form) && (
                  <div className="fr-col-12 fr-col-md-6">
                    <div className="fr-select-group">
                      <label className="fr-label" htmlFor="etb-trait-oblig-fr">
                        Un traitement d'atténuation est-il obligatoire pour les mouvements nationaux
                        ?
                      </label>
                      <select
                        className="fr-select"
                        id="etb-trait-oblig-fr"
                        required
                        value={form.traitementObligatoireFr}
                        onChange={(e) =>
                          update("traitementObligatoireFr", e.target.value as OuiNon)
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

                {/* Spec E5 : seulement pour une ovale barrée ou un traitement national obligatoire. */}
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
          )}
        </>
      )}

      {situation !== null && (
        <SituationImpossibleAlert message={MESSAGES_SITUATION_IMPOSSIBLE[situation]} />
      )}

      {situation === null && isVisible("zoneDestinataire", form) && (
        <>
          <h2 className="fr-h5 fr-mt-6w fr-mb-2w">2. Destination des viandes</h2>
          <hr />
          <p className="fr-text--xs">{PERIMETRE_VIANDES}</p>

          <section className="fr-mb-3w">
            <h3 className="fr-h6 fr-mb-2w flex items-center gap-2">
              <img src="/icons/truck.png" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
              <span>Informations sur l'établissement destinataire des viandes</span>
            </h3>

            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="etb-zone-dest">
                    Zone de l'établissement destinataire des viandes.
                    <CarteZonesHint />
                  </label>
                  <select
                    className="fr-select"
                    id="etb-zone-dest"
                    required
                    value={form.zoneDestinataire}
                    onChange={(e) => update("zoneDestinataire", e.target.value as ZoneChoix | "")}
                  >
                    <option value="" disabled>
                      Sélectionner une option
                    </option>
                    {ZONE_OPTIONS_AVEC_REFLEXE.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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
                      MCA ?<McaInfoTooltip />
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
