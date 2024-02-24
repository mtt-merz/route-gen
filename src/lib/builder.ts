import { readdirSync } from "fs";
import { join } from "node:path";
import { findElement } from "./utils";

export type Route = {
  index?: undefined | boolean;
  path?: undefined | string;
  element?: undefined | RouteElement;
  children?: undefined | Array<Route>;
};

export type RouteElement = {
  name: string;
  path: string;
};

export const buildRoute = (path: string, name = "/"): Route => {
  const fullPath = join(path, name);
  const dirents = readdirSync(fullPath, { withFileTypes: true });

  const children = dirents
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("_"))
    .map((dirent) => buildRoute(dirent.path, dirent.name));

  const page = findElement("page", dirents);
  if (page) children.push({ index: true, element: page });

  return {
    path: name,
    element: findElement("layout", dirents),
    children: children.length ? children : undefined,
  };
};
