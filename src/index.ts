#!/usr/bin/env node

import { parseArgs } from "node:util";
import { HELP } from "./constants/help.js";
import { generateRoutes } from "./features/generator.js";

try {
  const { values } = parseArgs({
    options: {
      help: { type: "boolean", short: "h" },
      watch: { type: "boolean", short: "w" },
      root: { type: "string", short: "r" },
    },
  });

  if (values.help) {
    console.log(HELP);
    process.exit();
  }

  const generate = () => generateRoutes(values);

  if (values.watch) {
    console.log("WATCH");
  }

  generate();
  process.exit();
} catch (error) {
  const errorString = error instanceof Error ? error.message : String(error);
  console.log(`\x1b[31m${errorString}\x1b[0m`);
}
