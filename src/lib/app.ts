import { Dirent as FsDirent } from "fs";
import { parse } from "node:path";
import { config } from "../config.js";

export type Dirent = Pick<FsDirent, "path" | "name" | "isDirectory" | "isFile">;

export const getAppDirent = (): Dirent => {
  const path = parse(config.root);

  return {
    path: path.dir,
    name: path.name,
    isDirectory: () => true,
    isFile: () => false,
  };
};
