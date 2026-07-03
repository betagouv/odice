// Logique pure d'affichage/dérivation des champs "traitement d'atténuation obligatoire"
// (simulateur Autres Établissements). Sans React, testable isolément.
// Deux simplifications d'affichage vérifiées sans impact sur la sortie du moteur
// (analyse de sensibilité sur les 32 928 cas de l'oracle) :
//   R1 : si "obligatoire FR" = oui, "obligatoire UE" est nécessairement oui (masqué).
//   R2 : en zone d'origine saine (indemne / ZRI), les deux champs sont sans objet.

import { Zone } from "@engine";

export type OuiNon = "oui" | "non" | "";

// R2 : les champs "traitement obligatoire" ne s'appliquent qu'aux zones réglementées.
export function isTraitementObligatoireApplicable(zoneSuides: Zone | null): boolean {
  return zoneSuides !== null && zoneSuides !== Zone.ZoneIndemne && zoneSuides !== Zone.ZRI;
}

// R1 + R2 : "obligatoire UE" masqué en zone saine, ou dès que "obligatoire FR" = oui.
export function isTraitementUeApplicable(
  zoneSuides: Zone | null,
  traitementObligatoireFr: OuiNon,
): boolean {
  return isTraitementObligatoireApplicable(zoneSuides) && traitementObligatoireFr !== "oui";
}

// Booléens transmis au moteur, avec forçage de UE = oui quand FR = oui (R1).
// Zone saine : valeurs sans objet, forcées à false (sans impact vérifié).
export function deriveTraitementObligatoire(
  zoneSuides: Zone | null,
  frValue: OuiNon,
  ueValue: OuiNon,
): { fr: boolean; ue: boolean } {
  if (!isTraitementObligatoireApplicable(zoneSuides)) return { fr: false, ue: false };
  if (frValue === "oui") return { fr: true, ue: true };
  return { fr: false, ue: ueValue === "oui" };
}
