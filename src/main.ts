import { writeFileSync } from "fs";
import config from "./config.json";
import { buildRoutes } from "./utils";

const main = () => {
  const routes = buildRoutes(config.path);

  const outPath = `${config.exportPath}/routes.json`;
  writeFileSync(outPath, JSON.stringify(routes, null, 2));

  console.log(`Routes written successfully in ${outPath}`);
};

main();
