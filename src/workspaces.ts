import Debug from "debug";
import { move, pathExistsSync, remove } from "fs-extra";
import { join } from "path";

import type { Workspace } from "./workspaces/types";

export const debug = Debug("yarn-workspace-focus-install:workspace");
export async function removeAllNodeModules(
  rootDir: string,
  workspaces: Record<string, Workspace>
): Promise<void[]> {
  debug("removeAllNodeModules", {
    rootDir,
    workspaces,
  });
  return Promise.all([
    remove(join(rootDir, "node_modules")),
    ...Object.entries(workspaces).map(async ([, { location }]) => {
      debug("remove ", join(rootDir, location, "node_modules"));
      return remove(join(rootDir, location, "node_modules"));
    }),
  ]);
}

export async function transferAllNodeModules(
  tmp: string,
  rootDir: string,
  workspaces: Record<string, Workspace>
): Promise<void[]> {
  debug("transferAllNodeModules", {
    rootDir,
    tmp,
    workspaces,
  });
  const moveFromTmpToRootDir = async (location: string) => {
    const source = join(tmp, location);
    const destination = join(rootDir, location);
    debug("move from '%s' to '%s", source, destination);
    return move(source, destination);
  };
  return Promise.all([
    moveFromTmpToRootDir("node_modules"),
    ...Object.entries(workspaces)
      .filter(([, { location }]) =>
        pathExistsSync(join(tmp, location, "node_modules"))
      )
      .map(async ([, { location }]) =>
        moveFromTmpToRootDir(join(location, "node_modules"))
      ),
  ]);
}
