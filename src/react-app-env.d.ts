/**
 * svgo plugin types
 */
declare module "svgo/lib/path" {
  export type PathDataCommand =
    | "M"
    | "m"
    | "Z"
    | "z"
    | "L"
    | "l"
    | "H"
    | "h"
    | "V"
    | "v"
    | "C"
    | "c"
    | "S"
    | "s"
    | "Q"
    | "q"
    | "T"
    | "t"
    | "A"
    | "a";

  export type PathDataItem = {
    command: PathDataCommand;
    args: number[];
  };

  export const parsePathData: (string: string) => PathDataItem[];

  type StringifyPathDataOptions = {
    pathData: PathDataItem[];
    precision?: number;
    disableSpaceAfterFlags?: boolean;
  };

  export const stringifyPathData: (options: StringifyPathDataOptions) => string;
}
