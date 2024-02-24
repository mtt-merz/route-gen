import { readFileSync, readdirSync } from "fs";
import { Route } from "./types";

type Dirent = ReturnType<typeof readdirSync>[number];

export const buildRoutes = (parent: string, dir = "/") => {
  const route: Route = {
    path: dir,
    children: [],
  };

  const path = `${parent}/${dir}`;
  const content = readdirSync(path, { withFileTypes: true });

  const layout = findLayout(content);
  if (layout) route.element = `<${layout} />`;

  const page = findPage(content);
  if (page) {
    route.children?.push({
      index: true,
      element: `<${page} />`,
    });
  }

  const subDirs = content.filter(
    (file) => file.isDirectory() && !file.name.startsWith("_"),
  );

  if (subDirs.length > 0)
    route.children = subDirs.map((dir) => buildRoutes(dir.path, dir.name));

  if (!route.children?.length) route.children = undefined;

  return route;
};

const findPage = (content: Array<Dirent>): undefined | string => {
  const file = content.find(
    (file) => file.isFile() && file.name.toLowerCase().includes("page"),
  );

  return file && getComponentName(file);
};

const findLayout = (content: Array<Dirent>): undefined | string => {
  const file = content.find(
    (file) => file.isFile() && file.name.toLowerCase().includes("layout"),
  );

  return file && getComponentName(file);
};

const getComponentName = (file: Dirent): undefined | string => {
  const data = readFileSync(`${file.path}/${file.name}`, "utf8");

  const reactComponentRegex =
    /(?<=\bexport\s+const\s+|export\s+default\s+const\s+)[A-Z][a-zA-Z0-9_]*(?=\s*:\s*React\.FC)/g;

  const match = reactComponentRegex.exec(data);
  if (match?.length) {
    console.log(match[0]);
    return match[0];
  }

  console.log("No component name found");
};
