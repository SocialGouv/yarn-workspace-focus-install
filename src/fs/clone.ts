import Debug from "debug";
import { copy } from "fs-extra";
import { join } from "path";

export const debug = Debug("yarn-workspace-focus-install:fs:clone");

export function cloneFolders(sourceDir: string, destDir: string) {
  return async function (location: string): Promise<void> {
    const source = join(sourceDir, location);
    const destination = join(destDir, location);
    debug("copy from '%s' to '%s", source, destination);
    return copy(source, destination);
  };
}
