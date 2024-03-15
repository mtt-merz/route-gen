import { readFileSync, readdirSync } from "fs";
import { join, parse } from "node:path";
import { findComponentName } from "../modules/visiter/index.js";
import { Dirent } from "./utils.js";

export type RouteData = {
  index?: undefined | boolean;
  path?: undefined | string;
  element?: undefined | RouteElement;
  children?: undefined | Array<RouteData>;
};

export type RouteElement = {
  name: string;
  path: string;
};

/**
 * Analyse the content files of a directory to recursively generate a route.
 *
 * @param {Dirent} dirent is the directory
 * @param {boolean} isRoot tells if the current dirent is the root
 * @return {RouteData} the route data contained in the directory
 * */
export const buildRoute = (dirent: Dirent, isRoot = true): RouteData => {
  const fullPath = join(dirent.path, dirent.name);
  const dirents = readdirSync(fullPath, { withFileTypes: true });

  const children = dirents
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("_"))
    .map((dirent) => buildRoute(dirent, false));

  const page = findElement("page", dirents);
  if (page) children.push({ index: true, element: page });

  return {
    path: isRoot ? "/" : dirent.name,
    element: findElement("layout", dirents),
    children: children.length ? children : undefined,
  };
};

const findElement = (
  label: string,
  dirents: Array<Dirent>,
): undefined | RouteElement => {
  const file = dirents.find(
    (file) => file.isFile() && file.name.toLowerCase().includes(label),
  );

  return (
    file && {
      name: getComponentName(file),
      path: getComponentPath(file),
    }
  );
};

const getComponentName = (file: Dirent): string => {
  const filePath = `${file.path}/${file.name}`;
  const fileContent = readFileSync(filePath, "utf8");

  return findComponentName(filePath, fileContent);
};

const getComponentPath = (file: Dirent): string => {
  const path = parse(join(file.path, file.name));
  return join(path.dir, path.name);
};
