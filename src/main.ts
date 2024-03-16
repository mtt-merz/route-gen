#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join } from "node:path";
import { buildRoute } from "./lib/builder.js";
import { transcribe } from "./lib/printer.js";
import { getRootDirent } from "./lib/utils.js";

try {
  const root = getRootDirent();

  const route = buildRoute(root);
  const path = join(root.path, "routes.tsx");
  writeFileSync(path, transcribe(route));

  console.log(`\x1b[32mRoutes generated in "${path}"\x1b[0m`);
} catch (error) {
  console.log(`\x1b[31m${error}\x1b[0m`);
}
