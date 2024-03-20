import { readdirSync } from "fs";
import { join, parse } from "node:path";
import { Dirent } from "../models/Dirent.js";
import { RouteData, RouteElement } from "../models/RouteData.js";

/**
 * Analyse the content files of a directory to recursively generate a route.
 *
 * @param {Dirent} dirent is the directory
 * @param isRoot tells if the current dirent is the root
 * @return {RouteData} the route data contained in the directory
 * */
export const scan = (dirent: Dirent, isRoot = true): RouteData => {
  const fullPath = join(dirent.path, dirent.name);
  const dirents = readdirSync(fullPath, { withFileTypes: true });

  const children = dirents
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("_"))
    .map((dirent) => scan(dirent, false));

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
  const filePath = dirents
    .filter((file) => file.isFile())
    .map((file) => parse(join(file.path, file.name)))
    .find((path) => path.name.toLowerCase().endsWith(label));

  return (
    filePath && {
      name: filePath.name,
      path: join(filePath.dir, filePath.name),
    }
  );
};
