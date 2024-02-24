const { writeFileSync } = require("fs");
const config = require("./config.json");
const { buildRoutes } = require("./utils.js");

const main = () => {
	const routes = buildRoutes(config.path);

	const outPath = `${config.exportPath}/routes.json`;
	writeFileSync(outPath, JSON.stringify(routes, null, "\t"));

	console.log(`Routes written successfully in ${outPath}`);
};

main();
