import { relative } from "node:path";
import { RouteData, RouteElement } from "../models/RouteData.js";
import {
  removeQuotesFromJsonKeys,
  removeQuotesInsideBrackets,
} from "../utils/utils.js";

type Route = {
  index?: undefined | boolean;
  path?: undefined | string;
  element?: undefined | string;
  children?: undefined | Array<Route>;
};

/**
 * Transcribe the route data to a string, with the following elements:
 *  - imports
 *  - paramHooks
 *  - routes
 *  This function is used to generate the routes.tsx file.
 *
 *  @param {RouteData} data is the route data
 *  @param {string} root is the routes root path, used to resolve imports
 *  @return {string} the transcribed route
 */
export const transcribe = (data: RouteData, root: string): string => {
  const { imports, paramHooks, routes } = resolveData(root, data);

  let formattedRoutes = JSON.stringify(routes, null, 2);
  formattedRoutes = removeQuotesFromJsonKeys(formattedRoutes);
  formattedRoutes = removeQuotesInsideBrackets(formattedRoutes);

  return (
    `// THIS FILE IS AUTOGENERATED, DO NOT EDIT.\n// Generated on ${new Date()}.\n\n` +
    `${Array.from(imports).join("\n")}` +
    `\n\n// ---- Path parameters hooks (${paramHooks.size}) ----\n\n` +
    `${Array.from(paramHooks).join("\n\n")}` +
    `\n\n// ---- Routes${""} ----\n\n` +
    `export const routes = [${formattedRoutes}];`
  );
};

const resolveData = (
  root: string,
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
    const elementImport = printImport({ ...element, root });
    imports.add(elementImport);
  }

  if (path?.startsWith(":")) {
    const paramHook = printHook(path);
    paramHooks.add(paramHook);
  }

  const childrenRoutes = children?.map((child) => {
    const resolvedChild = resolveData(root, child, imports, paramHooks);

    for (const imp of resolvedChild.imports) imports.add(imp);
    for (const hook of resolvedChild.paramHooks) paramHooks.add(hook);

    return resolvedChild.routes;
  });

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

const printImport = (element: RouteElement & { root: string }): string => {
  const { name, path, root } = element;

  return `import { ${name} } from "./${relative(root, path)}";`;
};

const printHook = (path: string): string => {
  const name = path.slice(1);
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return `
export const use${nameCapitalized}Param = (): string => {
  const { ${name} } = useParams();
  if (!${name}) {
    throw new Error("'${name}' is not a valid path parameter");
  }
  return ${name};
};`.slice(1);
};