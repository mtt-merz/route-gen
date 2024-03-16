import { readFileSync } from "fs";
import { isObject } from "./lib/utils.js";

const configKeys = ["root"] as const;
type Config = Record<(typeof configKeys)[number], string>;

const defaultConfig: Config = {
  root: "./src",
};

export const loadConfig = (): Config => {
  const path = "route-gen.json";

  function read(): string {
    try {
      return readFileSync(path, {
        encoding: "utf8",
        flag: "r",
      });
    } catch {
      return "{}";
    }
  }

  function parseJSON(rawConfig: string) {
    try {
      return JSON.parse(rawConfig);
    } catch {
      return undefined;
    }
  }

  const rawConfig = read();
  const config = parseJSON(rawConfig);

  if (!isObject(config))
    throw new Error("The configuration file is not valid.");
  for (const key of Object.keys(config)) {
    if (!configKeys.map(String).includes(key))
      throw new Error(`Unknown configuration "${key}".`);
  }

  return {
    ...defaultConfig,
    ...config,
  };
};
