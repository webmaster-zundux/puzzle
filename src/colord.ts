export * from "colord";
import * as CD from "colord";
import namesPlugin from "colord/plugins/names";

const { colord: originalColorD, extend } = CD;

extend([namesPlugin]);

export const colord = originalColorD;
