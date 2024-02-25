import { writeFileSync } from "fs";
import { join } from "node:path";
import { getAppDirent } from "./lib/app";
import { buildRoute } from "./lib/builder";
import { printRoute } from "./lib/printer";

const main = () => {
  const app = getAppDirent();
  if (!app) throw new Error("No app available");

  const route = buildRoute(app);
  const path = join(app.path, "routes.tsx");
  writeFileSync(path, printRoute(route));

  console.log("Routes written successfully");
};

main();
