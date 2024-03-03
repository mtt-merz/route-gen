#!/usr/bin/env ts-node

import { writeFileSync } from "fs";
import { join } from "node:path";
import { getAppDirent } from "./lib/app.js";
import { buildRoute } from "./lib/builder.js";
import { printRoute } from "./lib/printer.js";

  const app = getAppDirent();

  const route = buildRoute(app);
  const path = join(app.path, "routes.tsx");
  writeFileSync(path, printRoute(route));

  console.log("Routes written successfully");
