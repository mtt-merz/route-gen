import { Route } from "./builder";
import { removeQuotesFromJsonKeys, removeQuotesInsideBrackets } from "./utils";

type ResolvedRoute = {
  index?: undefined | boolean;
  path?: undefined | string;
  element?: undefined | string;
  children?: undefined | Array<ResolvedRoute>;
};

export const printRoute = (route: Route): string => {
  const { imports, resolvedRoute } = resolveRouteElements(route);

  let formattedRoute = JSON.stringify(resolvedRoute, null, 2);
  formattedRoute = removeQuotesFromJsonKeys(formattedRoute);
  formattedRoute = removeQuotesInsideBrackets(formattedRoute);
  const body = `export const routes = [${formattedRoute}];`;

  return `${imports.join("\n")}\n\n${body}\n`;
};

const resolveRouteElements = (
  route: Route,
  tempImports: Array<string> = [],
): { resolvedRoute: ResolvedRoute; imports: Array<string> } => {
  const { element, children } = route;

  const imports = [...tempImports];
  if (children)
    imports.push(
      ...children.flatMap(
        (child) => resolveRouteElements(child, imports).imports,
      ),
    );

  if (element) {
    const { name, path } = element;
    const relativePath = path.replace(/.*\/app/, "./app");

    imports.push(`import { ${name} } from "${relativePath}";`);
  }

  return {
    imports,
    resolvedRoute: {
      ...route,
      element: element && `<${element.name} />`,
      children: children?.map(
        (child) => resolveRouteElements(child, imports).resolvedRoute,
      ),
    },
  };
};
