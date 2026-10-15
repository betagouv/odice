// Formulaire de saisie du simulateur Abattoirs.
// Affichage progressif par section : chaque partie s'affiche une fois la précédente complète.
// Layout : abattoir, puis 1. provenance et 2. destination, champs en 2 colonnes (cf. maquette).

import { useMemo, useState, type FormEvent } from "react";
import { Statut, type AbattoirsInputs } from "@engine";
import {
  STATUT_LABELS,
  STATUT_ORDER,
  ZONE_OPTIONS_AVEC_REFLEXE,
  zoneMoteur,
  type ZoneChoix,
  isStatutApplicable,
} from "@shared/labels/abattoirs.labels";
import { CarteZonesHint } from "@shared/components/CarteZonesHint";
import { DocumentAnimauxHint } from "@shared/components/DocumentAnimauxHint";
import { McaInfoTooltip } from "@shared/components/McaInfoTooltip";
import { SituationImpossibleAlert } from "@shared/components/SituationImpossibleAlert";
import { MESSAGE_ZI_FS_REFLEXE_INTERDIT, ZONE_ZIFS_REFLEXE } from "@shared/labels/common.labels";
import { StatutInfoTooltip } from "./StatutInfoTooltip";
import {
  useProgressiveFields,
  type ProgressiveFieldConfig,
} from "@shared/hooks/useProgressiveFields";

type FormState = {
  zoneSuides: ZoneChoix | "";
  statut: Statut | "";
  zoneAbattoir: ZoneChoix | "";
  mcaAbattoir: "oui" | "non" | "";
  zoneEtbDestinataire: ZoneChoix | "";
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

// Révélation par section (spec) : abattoir, provenance, destination. Le statut
// ne s'ajoute à la provenance que pour les zones ZRII/ZRIII.
const FIELDS: ProgressiveFieldConfig<FormState>[] = [
  { key: "zoneAbattoir", section: "abattoir" },
  { key: "mcaAbattoir", section: "abattoir" },
  { key: "zoneSuides", section: "provenance" },
  {
    key: "statut",
    section: "provenance",
    isApplicable: (f) => isStatutApplicable(f.zoneSuides === "" ? null : zoneMoteur(f.zoneSuides)),
  },
  { key: "zoneEtbDestinataire", section: "destination" },
  { key: "mcaEtbDestinataire", section: "destination" },
];

type Props = {
  onSubmit: (inputs: AbattoirsInputs) => void;
  onReset: () => void;
  onChange?: () => void;
  // Premier renseignement de la zone de l'abattoir (démarrage du chrono de saisie).
  onStart?: () => void;
};

export function AbattoirsForm({ onSubmit, onReset, onChange, onStart }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const { isVisible, advance, revealAll } = useProgressiveFields(FIELDS, EMPTY_FORM);

  // Statut requis (= bloque la validation) uniquement pour ZRII/ZRIII.
  const statutRequired = useMemo(
    () => isStatutApplicable(form.zoneSuides === "" ? null : zoneMoteur(form.zoneSuides)),
    [form.zoneSuides],
  );

  // Mouvements de porcs issus de ZI FS réflexe interdits : alerte, destination masquée, Valider bloqué.
  const zoneSuidesBloquee = form.zoneSuides === ZONE_ZIFS_REFLEXE;

  const canSubmit =
    !zoneSuidesBloquee &&
    form.zoneSuides !== "" &&
    form.zoneAbattoir !== "" &&
    form.mcaAbattoir !== "" &&
    form.zoneEtbDestinataire !== "" &&
    form.mcaEtbDestinataire !== "" &&
    (!statutRequired || form.statut !== "");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (key === "zoneAbattoir" && value !== "") onStart?.();
    const next = { ...form, [key]: value };
    setForm(next);
    advance(next);
    onChange?.();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      zoneSuides: zoneMoteur(form.zoneSuides as ZoneChoix),
      statut: statutRequired && form.statut !== "" ? (form.statut as Statut) : null,
      zoneAbattoir: zoneMoteur(form.zoneAbattoir as ZoneChoix),
      mcaAbattoir: form.mcaAbattoir === "oui",
      zoneEtbDestinataire: zoneMoteur(form.zoneEtbDestinataire as ZoneChoix),
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
      <section className="fr-mb-3w">
        <h2 className="fr-h6 fr-mb-2w flex items-center gap-2">
          <img src="/icons/building.png" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
          <span>Informations sur votre abattoir</span>
        </h2>

        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
          <div className="fr-col-12 fr-col-md-6">
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="zone-abattoir">
                Zone de votre abattoir.
                <CarteZonesHint />
              </label>
              <select
                className="fr-select"
                id="zone-abattoir"
                required
                value={form.zoneAbattoir}
                onChange={(e) => update("zoneAbattoir", e.target.value as ZoneChoix | "")}
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

          {isVisible("mcaAbattoir", form) && (
            <div className="fr-col-12 fr-col-md-6">
              <div className="fr-select-group">
                <label className="fr-label" htmlFor="mca-abattoir">
                  Êtes-vous en possession d'un agrément zoosanitaire MCA ?
                  <McaInfoTooltip />
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

      {isVisible("zoneSuides", form) && (
        <>
          <h2 className="fr-h5 fr-mt-6w fr-mb-2w">1. Provenance des porcs</h2>
          <hr />

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
                  <label className="fr-label" htmlFor="zone-suides">
                    Zone d'origine des porcs.
                    <DocumentAnimauxHint />
                  </label>
                  <select
                    className="fr-select"
                    id="zone-suides"
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

              {isVisible("statut", form) && (
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="statut">
                      Statut réglementaire du mouvement des animaux.
                      <StatutInfoTooltip />
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
        </>
      )}

      {zoneSuidesBloquee && <SituationImpossibleAlert message={MESSAGE_ZI_FS_REFLEXE_INTERDIT} />}

      {!zoneSuidesBloquee && isVisible("zoneEtbDestinataire", form) && (
        <>
          <h2 className="fr-h5 fr-mt-6w fr-mb-2w">2. Destination des viandes</h2>
          <hr />

          <section className="fr-mb-3w">
            <h3 className="fr-h6 fr-mb-2w flex items-center gap-2">
              <img src="/icons/truck.png" alt="" aria-hidden="true" className="h-6 w-6 shrink-0" />
              <span>Informations sur l'établissement destinataire des viandes</span>
            </h3>

            <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom">
              <div className="fr-col-12 fr-col-md-6">
                <div className="fr-select-group">
                  <label className="fr-label" htmlFor="zone-dest">
                    Zone de l'établissement destinataire des viandes.
                    <CarteZonesHint />
                  </label>
                  <select
                    className="fr-select"
                    id="zone-dest"
                    required
                    value={form.zoneEtbDestinataire}
                    onChange={(e) =>
                      update("zoneEtbDestinataire", e.target.value as ZoneChoix | "")
                    }
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

              {isVisible("mcaEtbDestinataire", form) && (
                <div className="fr-col-12 fr-col-md-6">
                  <div className="fr-select-group">
                    <label className="fr-label" htmlFor="mca-dest">
                      L'établissement destinataire est-il en possession d'un agrément zoosanitaire
                      MCA ?<McaInfoTooltip />
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
