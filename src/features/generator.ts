import { writeFileSync } from "fs";
import { join } from "node:path";
import { Config } from "../models/Config.js";
import { loadConfig } from "../utils/config.js";
import { getRootDirent } from "../utils/utils.js";
import { scan } from "./scanner.js";
import { transcribe } from "./transcriber.js";

export const generateRoutes = (args: Partial<Config> = {}) => {
  const config = loadConfig(args);

  const root = getRootDirent(config.root);
  const content = transcribe(scan(root), config.root);

  const outPath = join(root.path, "routes.tsx");
  writeFileSync(outPath, content);

  console.log(`\x1b[32mRoutes generated in "${outPath}"\x1b[0m`);
};
