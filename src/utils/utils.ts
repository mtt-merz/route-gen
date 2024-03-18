import { existsSync } from "node:fs";
import { join } from "node:path";
import { Dirent } from "../models/Dirent.js";

export const getRootDirent = (path: string): Dirent => {
  const dirent = {
    path,
    name: "pages",
    isDirectory: () => true,
    isFile: () => false,
  };

  const fullPath = join(dirent.path, dirent.name);
  if (!existsSync(fullPath))
    throw new Error(`Pages directory "${fullPath}" does not exist.`);

  return dirent;
};

export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object";

export const removeQuotesFromJsonKeys = (jsonString: string): string => {
  const regex = /"([^"]+)"\s*:/g;
  return jsonString.replace(regex, "$1:");
};

export const removeQuotesInsideBrackets = (jsonString: string): string => {
  const regex = /"(<[^>]+>)"/g;
  return jsonString.replace(regex, "$1");
};
