import { constants, accessSync, readFileSync } from "fs";

const loadConfig = () => {
  const configFilePath = "./route-gen.json";

  try {
    accessSync(configFilePath, constants.F_OK);
    const rawConfigData = readFileSync(configFilePath);

    return JSON.parse(rawConfigData.toString());
  } catch {
    console.log("Local configuration not found, using default values.");
    return null;
  }
};

const defaultConfig = {
  root: "./src/app",
};

export const config: Record<string, string> = {
  ...defaultConfig,
  ...loadConfig(),
};
