import { Dirent as FsDirent } from "fs";

export type Dirent = Pick<FsDirent, "path" | "name" | "isDirectory" | "isFile">;
