/* eslint-disable @typescript-eslint/no-use-before-define */
//

import assert from "assert";
import Debug from "debug";
import findWorkspaceRoot from "find-yarn-workspace-root";
import { remove } from "fs-extra";
import { normalize, relative } from "path";
import slash from "slash";
import { directory } from "tempy";

import { cloneFolders } from "./fs/clone";
import { removeAllDependencies } from "./pkg/removeAllDependencies";
import { removeAllNodeModules, transferAllNodeModules } from "./workspaces";
import { getFocusPackageNameFromLocation } from "./workspaces/getPackageNameFromLocation";
import { mapLocations } from "./workspaces/mapLocations";
import { removeUnnecessaryDependencies } from "./workspaces/removeUnnecessaryWorkspaces";
import { removeWorkspacesDevDependencies } from "./workspaces/removeWorkspacesDevDependencies";
import { Workspace } from "./workspaces/types";
import { getWorkspaces, yarnInstall } from "./yarn";

export const debug = Debug("yarn-workspace-focus-install:install");

export async function focusInstall({
  cwd = process.cwd(),
  production = false,
  dryRun = false,
}): Promise<void> {
  debug({ cwd, dryRun, production });

  // Guard
  assert(cwd, "cwd should be defined");
  const workspaceRoot = findWorkspaceRoot(cwd);
  assert(workspaceRoot, "Should be in a workspace");
  assert(cwd !== workspaceRoot, "cwd should not be the workspace root");

  const workspaces = await getWorkspaces();

  const pkgLocation = slash(normalize(relative(workspaceRoot, cwd)));
  const focusPkgName = getFocusPackageNameFromLocation(workspaces, pkgLocation);
  debug({ focusPkgName, pkgLocation });

  const tmp = await initializeTmpClone(workspaceRoot, workspaces);

  await removeUnnecessaryDependencies(tmp, workspaces, pkgLocation);

  await Promise.all([
    removeWorkspacesDevDependencies(tmp, workspaces, pkgLocation, {
      production,
    }),
    removeAllDependencies(tmp),
  ]);

  await yarnInstall(tmp);

  if (dryRun) {
    console.info("[dryRun mode] Focus installation done in " + tmp);
    return;
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
