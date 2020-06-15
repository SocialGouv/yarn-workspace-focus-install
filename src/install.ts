//

import assert from "assert";
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

export async function install({
  cwd = process.cwd(),
  production = false,
  dryRun = false,
}): Promise<void> {
  const tmp = directory();
  const workspaces = await getWorkspaces();
  const workspaceRoot = findWorkspaceRoot(cwd);

  assert(workspaceRoot, "Should be in a workspace");
  assert(cwd, "cwd should be defined");
  assert(cwd !== workspaceRoot, "cwd should not be the workspace root");
  const pkgLocation = relative(workspaceRoot, cwd);
  const focusPkgName = getFocusPackageNameFromLocation(workspaces, pkgLocation);
  assert(focusPkgName);

  await Promise.all([
    copy(join(workspaceRoot, "package.json"), join(tmp, "package.json")),
    copy(join(workspaceRoot, "yarn.lock"), join(tmp, "yarn.lock")),
  ]);

  await Promise.all(
    Object.entries(workspaces).map(async ([, { location }]) =>
      copy(
        `${workspaceRoot}/${location}/package.json`,
        `${tmp}/${location}/package.json`
      )
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
