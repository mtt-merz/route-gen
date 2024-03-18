#!/usr/bin/env node

import { join, sep } from "node:path";
import { parseArgs } from "node:util";
import { watch } from "chokidar";
import { HELP } from "./constants/help.js";
import { generateRoutes } from "./features/generator.js";
import { loadConfig } from "./utils/config.js";
import { getDirent } from "./utils/utils.js";

try {
  const { values } = parseArgs({
    options: {
      help: { type: "boolean", short: "h" },
      root: { type: "string", short: "r" },
      watch: { type: "boolean", short: "w" },
    },
  });

  if (values.help) {
    console.log(HELP);
    process.exit();
  }

  const config = loadConfig(values);
  const root = getDirent(config.root, "pages");

  const generate = () => generateRoutes(root);
  generate();

  if (values.watch) {
    console.log("\nWatching for changes... Press Ctrl+C to exit.");

    const watcher = watch(join(root.path, root.name), {
      //ignore folders starting with _ and all files inside them
      ignored: (path) => {
        const pathComponents = path.split(sep);
        return pathComponents.some((component) => component.startsWith("_"));
      },
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on("all", (event, path) => {
          console.log(`\nEvent ${event} for ${path}`);
          generate();
        },
    );
  }
} catch (error) {
  const errorString = error instanceof Error ? error.message : String(error);
  console.log(`\x1b[31m${errorString}\x1b[0m`);
}
