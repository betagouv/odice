// Formulaire de saisie du simulateur Autres Établissements.
// Affichage progressif : un seul champ au départ, chaque saisie révèle le suivant.
// Layout : votre établissement, puis 1. provenance et 2. destination (cf. maquette).

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Marque, Zone, type EtablissementsInputs } from "@engine";
import {
  MARQUE_LABELS,
  MARQUE_ORDER,
  MCA_TOOLTIP,
  PERIMETRE_VIANDES,
  ZONE_LABELS,
  ZONE_ORDER,
} from "@shared/labels/etablissements.labels";
import {
  useProgressiveFields,
  type ProgressiveFieldConfig,
} from "@shared/hooks/useProgressiveFields";
import { ROUTES } from "@shared/config/routes.config";
import { CarteZonesHint } from "@shared/components/CarteZonesHint";
import { InfoTooltip } from "@shared/components/InfoTooltip";
import {
  deriveTraitementObligatoire,
  isTraitementObligatoireApplicable,
  isTraitementUeApplicable,
  type OuiNon,
} from "./traitementFields";

const zoneOrNull = (zone: Zone | ""): Zone | null => (zone === "" ? null : zone);

type FormState = {
  zoneExpediteur: Zone | "";
  mcaExpediteur: OuiNon;
  zoneSuides: Zone | "";
  marqueViandes: Marque | "";
  traitementObligatoireFr: OuiNon;
  traitementObligatoireUe: OuiNon;
  traitementRealise: OuiNon;
  zoneDestinataire: Zone | "";
  mcaDestinataire: OuiNon;
};

const EMPTY_FORM: FormState = {
  zoneExpediteur: "",
  mcaExpediteur: "",
  zoneSuides: "",
  marqueViandes: "",
  traitementObligatoireFr: "",
  traitementObligatoireUe: "",
  traitementRealise: "",
  zoneDestinataire: "",
  mcaDestinataire: "",
};

// Séquence de révélation des 9 champs. Les deux champs "traitement obligatoire"
// sont masqués selon la zone d'origine (R2) et la réponse FR (R1). Voir traitementFields.ts.
const FIELDS: ProgressiveFieldConfig<FormState>[] = [
  { key: "zoneExpediteur" },
  { key: "mcaExpediteur" },
  { key: "zoneSuides" },
  { key: "marqueViandes" },
  {
    key: "traitementObligatoireFr",
    isApplicable: (f) => isTraitementObligatoireApplicable(zoneOrNull(f.zoneSuides)),
  },
  {
    key: "traitementObligatoireUe",
    isApplicable: (f) =>
      isTraitementUeApplicable(zoneOrNull(f.zoneSuides), f.traitementObligatoireFr),
  },
  { key: "traitementRealise" },
  { key: "zoneDestinataire" },
  { key: "mcaDestinataire" },
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
  const canSubmit = FIELDS.every((field) => {
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
    const traitementObligatoire = deriveTraitementObligatoire(
      zoneOrNull(form.zoneSuides),
      form.traitementObligatoireFr,
      form.traitementObligatoireUe,
    );
    onSubmit({
      zoneSuides: form.zoneSuides as Zone,
      marqueViandes: form.marqueViandes as Marque,
      traitementObligatoireFr: traitementObligatoire.fr,
      traitementObligatoireUe: traitementObligatoire.ue,
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
                  Êtes-vous en possession d'un agrément zoosanitaire MCA ?
                  <InfoTooltip>{MCA_TOOLTIP}</InfoTooltip>
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
              Si vous avez un produit composé d'un mélange de viandes issues de zones différentes,{" "}
              {/* Cible provisoire en attendant le tableau des mélanges (à fournir par le métier). */}
              <Link to={ROUTES.DOCUMENTATION_REGLEMENTAIRE}>référez-vous à ce tableau</Link>.
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

              <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="etb-marque-viandes">
                      Marque sanitaire présente sur les viandes à réception.
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
              </div>

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
                        onChange={(e) =>
                          update("traitementObligatoireUe", e.target.value as OuiNon)
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

                {/* Absent de la maquette mais requis par le moteur : placé avec les autres
                    questions de traitement. */}
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

      {isVisible("zoneDestinataire", form) && (
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
                      MCA ?<InfoTooltip>{MCA_TOOLTIP}</InfoTooltip>
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
