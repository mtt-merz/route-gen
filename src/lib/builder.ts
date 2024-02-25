import { readdirSync } from "fs";
import { join } from "node:path";
import { Dirent } from "./app";
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

/**
 * Analyse the content files of a directory to recursively generate a route.
 *
 * @param {Dirent} dirent is the directory
 * @return {Route} the route contained in the directory
 * */
export const buildRoute = (dirent: Dirent): Route => {
  const fullPath = join(dirent.path, dirent.name);
  const dirents = readdirSync(fullPath, { withFileTypes: true });

  const children = dirents
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("_"))
    .map(buildRoute);

  const page = findElement("page", dirents);
  if (page) children.push({ index: true, element: page });

  return {
    path: dirent.name,
    element: findElement("layout", dirents),
    children: children.length ? children : undefined,
  };
};
