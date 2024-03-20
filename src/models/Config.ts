export const configKeys = ["root"] as const;

export type Config = Record<(typeof configKeys)[number], string>;
