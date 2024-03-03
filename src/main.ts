#!/usr/bin/env ts-node

import { writeFileSync } from "fs";
import { join } from "node:path";
import { buildRoute } from "./lib/builder.js";
import { printRoute } from "./lib/printer.js";
import { getRootDirent } from "./lib/utils.js";

const root = getRootDirent();

const route = buildRoute(root);
const path = join(root.path, "routes.tsx");
writeFileSync(path, printRoute(route));

console.log("Routes written successfully");
