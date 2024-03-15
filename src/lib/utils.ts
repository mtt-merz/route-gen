import { Dirent as FsDirent } from "fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "../config.js";

export type Dirent = Pick<FsDirent, "path" | "name" | "isDirectory" | "isFile">;

export const getRootDirent = (): Dirent => {
  const dirent = {
    path: config.root,
    name: "pages",
    isDirectory: () => true,
    isFile: () => false,
  };

  const fullPath = join(dirent.path, dirent.name);
  if (!existsSync(fullPath))
    throw new Error(`Pages directory "${fullPath}" does not exist.`);

  return dirent;
};
