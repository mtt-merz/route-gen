import { existsSync, lstatSync } from "node:fs";
import { join, parse } from "node:path";
import { Dirent } from "../models/Dirent.js";

export const getDirent = (...arg: Array<string>): Dirent => {
  const fullPath = join(...arg);
  if (!existsSync(fullPath))
    throw new Error(`Path "${fullPath}" does not exist.`);

  const path = parse(fullPath);
  const stats = lstatSync(fullPath);

  return {
    path: path.dir,
    name: path.base,
    isDirectory: stats.isDirectory,
    isFile: stats.isFile,
  };
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
