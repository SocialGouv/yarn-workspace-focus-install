//

import assert from "assert";
import Debug from "debug";
import findWorkspaceRoot from "find-yarn-workspace-root";
import { copy, remove } from "fs-extra";
import { join, relative } from "path";
import { directory } from "tempy";

import {
  getFocusPackageNameFromLocation,
  removeAllDependencies,
  removeAllNodeModules,
  removeUnnecessaryWorkspaces,
  removeWorkspacesDevDependencies,
  transferAllNodeModules,
} from "./workspaces";
import { getWorkspaces, yarnInstall } from "./yarn";

const debug = Debug("yarn-workspace-focus-install:install");

function copyFromWorkspaceToTmp(workspaceRoot: string, tmp: string) {
  return async function (location: string) {
    const source = join(workspaceRoot, location);
    const destination = join(tmp, location);
    debug("copy from '%s' to '%s", source, destination);
    return copy(source, destination);
  };
}

export async function install({
  cwd = process.cwd(),
  production = false,
  dryRun = false,
}): Promise<void> {
  debug({ cwd, dryRun, production });
  const tmp = directory();
  const workspaces = await getWorkspaces();
  const workspaceRoot = findWorkspaceRoot(cwd);
  debug({ tmp, workspaceRoot, workspaces });

  assert(workspaceRoot, "Should be in a workspace");
  const cp = copyFromWorkspaceToTmp(workspaceRoot, tmp);
  assert(cwd, "cwd should be defined");
  assert(cwd !== workspaceRoot, "cwd should not be the workspace root");
  const pkgLocation = relative(workspaceRoot, cwd);
  const focusPkgName = getFocusPackageNameFromLocation(workspaces, pkgLocation);
  debug({ focusPkgName, pkgLocation });
  assert(focusPkgName);

  debug("copy package.json and yarn.lock from '%s' to '%s", workspaceRoot, tmp);
  await Promise.all([cp("package.json"), cp("yarn.lock")]);

  await Promise.all(
    Object.entries(workspaces).map(async ([, { location }]) =>
      cp(`${location}/package.json`)
    )
  );

  await removeUnnecessaryWorkspaces(tmp, workspaces, pkgLocation);

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
