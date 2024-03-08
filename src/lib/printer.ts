import { RouteData, RouteElement } from "./builder.js";
import {relative, sep} from "node:path";
import { config } from "../config.js";

type Route = {
  index?: undefined | boolean;
  path?: undefined | string;
  element?: undefined | string;
  children?: undefined | Array<Route>;
};

export const transcribe = (data: RouteData): string => {
  const { imports, paramHooks, routes } = resolveData(data);

  let formattedRoutes = JSON.stringify(routes, null, 2);
  formattedRoutes = removeQuotesFromJsonKeys(formattedRoutes);
  formattedRoutes = removeQuotesInsideBrackets(formattedRoutes);

  return (
    `${Array.from(imports).join("\n")}\n` +
    `${Array.from(paramHooks).join("\n")}\n\n` +
    `export const routes = [${formattedRoutes}];`
  );
};

const resolveData = (
  data: RouteData,
  imports: Set<string> = new Set(),
  paramHooks: Set<string> = new Set(),
): {
  imports: Set<string>;
  paramHooks: Set<string>;
  routes: Route;
} => {
  const { path, element, children } = data;

  if (element) {
    const elementImport = printImport(element);
    imports.add(elementImport);
  }

  if (path?.startsWith(":")) {
    const paramHook = printHook(path);
    paramHooks.add(paramHook);
  }

  const childrenRoutes = [];
  for (const child of children ?? []) {
    const resolvedChild = resolveData(child, imports, paramHooks);

    childrenRoutes.push(resolvedChild.routes);
    for (const imp of resolvedChild.imports) imports.add(imp);
    for (const hook of resolvedChild.paramHooks) paramHooks.add(hook);
  }

  if (paramHooks.size) {
    imports.add(`import { useParams } from "react-router-dom";`);
  }

  return {
    imports,
    paramHooks,
    routes: {
      ...data,
      element: element && `<${element.name} />`,
      children: childrenRoutes,
    },
  };
};

const printImport = (element: RouteElement): string => {
  const { name, path } = element;
  const root = config.root.split(sep).slice(0, -1).join(sep);

  return `import { ${name} } from "./${relative(root, path)}";`;
};

const printHook = (path: string): string => {
  const name = path.slice(1);
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return `
export const use${nameCapitalized}Param = (): string  => {
  const { ${name} } = useParams();
  if (!${name}) throw new Error("\\"${name}\\" is not a valid path parameter");
  return ${name};
};`;
};

const removeQuotesFromJsonKeys = (jsonString: string): string => {
  const regex = /"([^"]+)"\s*:/g;
  return jsonString.replace(regex, "$1:");
};

function removeQuotesInsideBrackets(jsonString: string): string {
  const regex = /"(<[^>]+>)"/g;
  return jsonString.replace(regex, "$1");
}
