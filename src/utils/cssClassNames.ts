export const cssClassNames = (classNames: unknown[]): string => classNames.filter((v) => v).join(" ");

export const cn = cssClassNames;
