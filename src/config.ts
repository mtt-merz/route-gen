import { constants, accessSync, readFileSync } from "fs";
import { z } from "zod";

const Config = z.object({
  root: z.string(),
});
type Config = z.infer<typeof Config>;

const loadConfig = (): null | Config => {
  const configFilePath = "./route-gen.json";

  try {
    accessSync(configFilePath, constants.F_OK);
    const rawConfigData = readFileSync(configFilePath);

    const config = JSON.parse(rawConfigData.toString());
    return Config.parse(config);
  } catch {
    return null;
  }
};

const defaultConfig: Config = {
  root: "./src/pages",
};

export const config: Config = {
  ...defaultConfig,
  ...loadConfig(),
};
