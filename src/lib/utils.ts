import { readFileSync, readdirSync } from "fs";
import { join } from "node:path";
import { RouteElement } from "./builder";

type Dirent = ReturnType<typeof readdirSync>[number];

export const findElement = (
  label: string,
  dirents: Array<Dirent>,
): undefined | RouteElement => {
  const file = dirents.find(
    (file) => file.isFile() && file.name.toLowerCase().includes(label),
  );

  return (
    file && {
      name: getComponentName(file),
      path: join(file.path, file.name.split(".")[0]),
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

export const removeQuotesFromJsonKeys = (jsonString: string): string => {
  const regex = /"([^"]+)"\s*:/g;
  return jsonString.replace(regex, "$1:");
};

export function removeQuotesInsideBrackets(jsonString: string): string {
  const regex = /"(<[^>]+>)"/g;
  return jsonString.replace(regex, "$1");
}
