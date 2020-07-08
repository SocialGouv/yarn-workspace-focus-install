/* eslint-disable @typescript-eslint/no-use-before-define */
//

import assert from "assert";
import Debug from "debug";
import findWorkspaceRoot from "find-yarn-workspace-root";
import { remove } from "fs-extra";
import { join, normalize, relative } from "path";
import slash from "slash";
import { directory } from "tempy";

import { cloneFolders } from "./fs/clone";
import { removeAllDependencies } from "./pkg/removeAllDependencies";
import { removeKeys } from "./pkg/removeKeys";
import { removeAllNodeModules, transferAllNodeModules } from "./workspaces";
import { mapLocations } from "./workspaces/mapLocations";
import { nameFromLocation } from "./workspaces/nameFromLocation";
import { Workspace } from "./workspaces/types";
import { unnecessaryDependencies } from "./workspaces/unnecessaryDependencies";
import { getWorkspaces, yarnInstall } from "./yarn";

export const debug = Debug("yarn-workspace-focus-install:install");

export async function focusInstall({
  cwd = process.cwd(),
  production = false,
  dryRun = false,
  yarnArgs = [],
}: {
  cwd?: string;
  production?: boolean;
  dryRun?: boolean;
  yarnArgs?: string[];
}): Promise<void> {
  debug({ cwd, dryRun, production, yarnArgs });

  // Guard
  assert(cwd, "cwd should be defined");
  const workspaceRoot = findWorkspaceRoot(cwd);
  assert(workspaceRoot, "Should be in a workspace");
  assert(cwd !== workspaceRoot, "cwd should not be the workspace root");

  const workspaces = await getWorkspaces();

  const pkgLocation = slash(normalize(relative(workspaceRoot, cwd)));
  const focusPkgName = nameFromLocation(workspaces, pkgLocation);
  debug({ focusPkgName, pkgLocation });

  const tmp = await initializeTmpClone(workspaceRoot, workspaces);

  await Promise.all(
    mapLocations(
      unnecessaryDependencies(workspaces, focusPkgName),
      async (location) => removeAllDependencies(join(tmp, location))
    )
  );

  await Promise.all([
    ...mapLocations(workspaces, async (location) => {
      if (location === pkgLocation) {
        if (!production) return;
        // remove focus workspace devDependencies too
      }
      await removeKeys(join(tmp, location), ["devDependencies"]);
    }),
    removeAllDependencies(tmp),
  ]);

  await yarnInstall(tmp, {}, yarnArgs);

  if (dryRun) {
    console.info("[dryRun mode] Focus installation done in " + tmp);
    return Promise.resolve();
  }

  await removeAllNodeModules(workspaceRoot, workspaces);
  await transferAllNodeModules(tmp, workspaceRoot, workspaces);

  await remove(tmp);
}

async function initializeTmpClone(
  source: string,
  workspaces: Record<string, Workspace>
) {
  const tmp = directory();
  debug({ source, tmp, workspaces });

  const cp = cloneFolders(source, tmp);

  debug("copy package.json and yarn.lock from '%s' to '%s", source, tmp);
  await Promise.all([cp("package.json"), cp("yarn.lock")]);

  await Promise.all(
    mapLocations(workspaces, async (location) => cp(`${location}/package.json`))
  );

  return tmp;
}
