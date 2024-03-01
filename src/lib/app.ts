import { readdirSync } from "fs";
import { join } from "node:path";

export type Dirent = ReturnType<typeof readdirSync>[number];

/**
 * Recursively looks for a directory called "app", starting from the specified path.
 *
 * @param {string} path is the starting point of the search, default to the working directory.
 * @return {undefined | Dirent} the app directory or undefined.
 */
export const getAppDirent = (path = "."): undefined | Dirent => {
  const dirents = readdirSync(path, { withFileTypes: true });

  for (const dirent of dirents) {
    if (!dirent.isDirectory()) continue;
    if (dirent.name === "app") return dirent;

    const direntFullPath = join(dirent.path, dirent.name);
    const app = getAppDirent(direntFullPath);
    if (app) return app;
  }
};
