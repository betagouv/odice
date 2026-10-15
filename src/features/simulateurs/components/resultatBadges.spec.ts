import { describe, expect, it } from "vitest";
import { Certification, LPS, Marque, Mouvement, Traitement } from "@engine";
import type { SimulationOutputs } from "./SimulationResult";
import { resultatBadges } from "./resultatBadges";

const AUTORISE: SimulationOutputs = {
  marque: Marque.Ovale,
  frMouvement: Mouvement.Autorise,
  ueMouvement: Mouvement.Autorise,
  frTraitement: Traitement.NonObligatoire,
  ueTraitement: Traitement.NonObligatoire,
  frDocument: LPS.Systematique,
  ueDocument: Certification.Obligatoire,
};

describe("resultatBadges", () => {
  it("donne libellés et couleurs de la nomenclature", () => {
    const badges = resultatBadges(AUTORISE);
    expect(badges.mouvement.france).toEqual({ label: "MOUVEMENT AUTORISÉ", variant: "success" });
    expect(badges.details?.traitement.france).toEqual({
      label: "NON-OBLIGATOIRE",
      variant: "success",
    });
    expect(badges.details?.document.france).toEqual({
      label: "LAISSEZ-PASSER SANITAIRE SYSTÉMATIQUE",
      variant: "info",
    });
    expect(badges.details?.document.ue?.label).toBe("CERTIFICAT ZOOSANITAIRE");
  });

  it("ovale barrée : UE interdit sans traitement, lignes UE masquées", () => {
    const badges = resultatBadges({
      ...AUTORISE,
      marque: Marque.OvaleBarree,
      ueMouvement: Mouvement.Interdit,
      ueTraitement: Traitement.Obligatoire,
      ueDocument: null,
    });
    expect(badges.mouvement.ue.label).toBe("MOUVEMENT INTERDIT SANS TRAITEMENT D'ATTÉNUATION");
    expect(badges.details?.marqueBadge?.label).toBe("OVALE BARRÉE");
    expect(badges.details?.traitement.ue).toBeNull();
    expect(badges.details?.document.ue).toBeNull();
  });

  it("FR interdit : aucun détail", () => {
    const badges = resultatBadges({
      ...AUTORISE,
      marque: null,
      frMouvement: Mouvement.Interdit,
      ueMouvement: Mouvement.Interdit,
    });
    expect(badges.details).toBeNull();
    expect(badges.mouvement.france.variant).toBe("error");
  });
});
