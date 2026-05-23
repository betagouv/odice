import { describe, it, expect } from "vitest";
import { evaluateAbattoir } from "./evaluate";
import { Statut, Zone, type AbattoirsInputs } from "./types";

describe("evaluateAbattoir (stub temporaire)", () => {
  it("est exporté avec la bonne signature", () => {
    const input: AbattoirsInputs = {
      zoneSuides: Zone.ZoneIndemne,
      statut: Statut.MrPpa,
      zoneAbattoir: Zone.ZoneIndemne,
      mcaAbattoir: true,
      zoneEtbDestinataire: Zone.ZoneIndemne,
      mcaEtbDestinataire: true,
    };
    // Le stub actuel throw : on vérifie juste qu'il existe.
    // Sera remplacé par le test oracle une fois l'implémentation faite.
    expect(() => evaluateAbattoir(input)).toThrow(/implémentation en cours/);
  });
});
