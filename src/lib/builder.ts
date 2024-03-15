import { readFileSync, readdirSync } from "fs";
import { join, parse } from "node:path";
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
  const data = readFileSync(`${file.path}/${file.name}`, "utf8");

  const reactComponentRegex =
    /(?<=\bexport\s+const\s+|export\s+default\s+const\s+)[A-Z][a-zA-Z0-9_]*(?=\s*:\s*React\.FC)/g;

  const match = reactComponentRegex.exec(data);
  if (match?.length) return match[0];
  throw new Error(`Could not find component '${file.path}'`);
};

const getComponentPath = (file: Dirent): string => {
  const path = parse(join(file.path, file.name));
  return join(path.dir, path.name);
};
