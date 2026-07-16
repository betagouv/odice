import { describe, expect, it } from "vitest";
import { MATOMO_DIMENSIONS, buildCustomDimensions } from "./dimensions";

const DIMENSIONS = { type_etablissement: 3, zone_suides: 5 };

describe("buildCustomDimensions", () => {
  it("mappe chaque valeur vers l'id configuré", () => {
    const result = buildCustomDimensions(
      {
        [MATOMO_DIMENSIONS.TYPE_ETABLISSEMENT]: "abattoir",
        [MATOMO_DIMENSIONS.ZONE_SUIDES]: "zrii",
      },
      DIMENSIONS,
    );
    expect(result).toEqual({ 3: "abattoir", 5: "zrii" });
  });

  it("ignore une dimension dont l'id n'est pas configuré", () => {
    const result = buildCustomDimensions(
      { [MATOMO_DIMENSIONS.TYPE_ETABLISSEMENT]: "abattoir" },
      { zone_suides: 5 },
    );
    expect(result).toEqual({});
  });

  it("ignore les valeurs vides ou absentes", () => {
    const result = buildCustomDimensions(
      { [MATOMO_DIMENSIONS.TYPE_ETABLISSEMENT]: "", [MATOMO_DIMENSIONS.ZONE_SUIDES]: "zp" },
      DIMENSIONS,
    );
    expect(result).toEqual({ 5: "zp" });
  });
});
