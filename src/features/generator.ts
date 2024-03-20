import { writeFileSync } from "fs";
import { join } from "node:path";
import { Dirent } from "../models/Dirent.js";
import { scan } from "./scanner.js";
import { transcribe } from "./transcriber.js";

export const generateRoutes = (root: Dirent) => {
  const route = scan(root);
  const content = transcribe(route, root.path);

  const outPath = join(root.path, "routes.tsx");
  writeFileSync(outPath, content);

  console.log(`\x1b[32mRoutes generated in "${outPath}"\x1b[0m`);
};
