import { writeFileSync } from "fs";
import { join } from "node:path";
import config from "./config.json";
import { buildRoute } from "./lib/builder";
import { printRoute } from "./lib/printer";

const main = () => {
  const route = buildRoute(config.path);

  const exportFullPath = join(config.exportPath, "routes.tsx");
  const data = printRoute(route);
  writeFileSync(exportFullPath, data);

  console.log(`Routes written successfully in ${exportFullPath}`);
};

main();
