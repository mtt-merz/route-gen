#!/usr/bin/env node

import { generateRoutes } from "./features/generator.js";

try {
  generateRoutes();
  process.exit();
} catch (error) {
  console.log(`\x1b[31m${error}\x1b[0m`);
}
