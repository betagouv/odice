// API publique du bounded context Abattoirs.

export type { AbattoirsInputs, AbattoirsOutputs } from "./types";
export { abattoirsInputsSchema } from "./schema";
export { parseAbattoirsInputs, safeParseAbattoirsInputs } from "./parse";
export { evaluateAbattoir } from "./evaluate";
export { ABATTOIRS_VERSIONS, type SimulateurVersion } from "./versions";
