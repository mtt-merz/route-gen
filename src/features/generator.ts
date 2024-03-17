import { writeFileSync } from "fs";
import { join } from "node:path";
import { getRootDirent } from "../utils/utils.js";
import { scan } from "./scanner.js";
import { transcribe } from "./transcriber.js";

export const generateRoutes = () => {
  const root = getRootDirent();

  const route = scan(root);
  const path = join(root.path, "routes.tsx");
  writeFileSync(path, transcribe(route));

  console.log(`\x1b[32mRoutes generated in "${path}"\x1b[0m`);
};
