import { Route } from "./builder";
import { removeQuotesFromJsonKeys, removeQuotesInsideBrackets } from "./utils";

type InternalRoute = {
  index?: undefined | boolean;
  path?: undefined | string;
  element?: undefined | string;
  children?: undefined | Array<InternalRoute>;
};

export const printRoute = (tempRoute: Route): string => {
  const { imports, route } = resolveRouteElements(tempRoute);

  let formattedRoute = JSON.stringify(route, null, 2);
  formattedRoute = removeQuotesFromJsonKeys(formattedRoute);
  formattedRoute = removeQuotesInsideBrackets(formattedRoute);
  const body = `export const routes = [${formattedRoute}];`;

  return `${imports.join("\n")}\n\n${body}\n`;
};

const resolveRouteElements = (
  tempRoute: Route,
  tempImports: Array<string> = [],
): { route: InternalRoute; imports: Array<string> } => {
  const { element, children } = tempRoute;

  const imports = [...tempImports];
  if (children)
    imports.push(
      ...children.flatMap(
        (child) => resolveRouteElements(child, imports).imports,
      ),
    );

  if (element) {
    const { name, path } = element;
    imports.push(
      `import { ${name} } from "${path.substring(0, path.length - 3)}"; `,
    );
  }

  return {
    imports,
    route: {
      ...tempRoute,
      element: element && `<${element.name} />`,
      children: children?.map(
        (child) => resolveRouteElements(child, imports).route,
      ),
    },
  };
};
