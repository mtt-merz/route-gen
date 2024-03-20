import { readFileSync } from "fs";
import { Config, configKeys } from "../models/Config.js";
import { ConfigError } from "../models/errors/ConfigError.js";
import { isObject } from "./utils.js";

const defaultConfig: Config = {
  root: "./src",
};

export const loadConfig = (args: Partial<Config>): Config => {
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
    throw new ConfigError("The configuration file is not valid.");
  for (const key of Object.keys(config)) {
    if (!configKeys.map(String).includes(key))
      throw new ConfigError(`Unknown configuration "${key}".`);
  }

  return {
    ...defaultConfig,
    ...config,
    ...args,
  };
};
