import assert from "assert";
import Debug from "debug";
import { move, pathExistsSync, remove } from "fs-extra";
import slash from "slash";

import { removePackageJsonKeys } from "./pkg";
import { uniqueUnion } from "./utils";

const debug = Debug("yarn-workspace-focus-install:workspace");
export interface Workspace {
  location: string;
  workspaceDependencies: string[];
}

export function getFocusPackageNameFromLocation(
  workspaces: Record<string, Workspace>,
  focusLocation: string
): string {
  debug("getFocusPackageNameFromLocation", { focusLocation, workspaces });
  const unixFocusLocation = slash(focusLocation);
  const [name] =
    Object.entries(workspaces).find(
      ([, { location }]) => location === unixFocusLocation
    ) ?? [];

  assert(name, `${unixFocusLocation} is not in the workspace tree`);

  return name;
}

export function listInternalWorkspaceDependencies(
  workspaces: Record<string, Workspace>,
  name: string,
  dependencies = new Set<string>()
): Set<string> {
  debug("listInternalWorkspaceDependencies", {
    dependencies,
    name,
    workspaces,
  });
  const { workspaceDependencies } = workspaces[name];
  if (!workspaceDependencies.length) {
    return dependencies;
  }

  const deps = uniqueUnion<string>(dependencies, workspaceDependencies);

  return uniqueUnion<string>(
    ...workspaceDependencies.map((workspace) => {
      return listInternalWorkspaceDependencies(workspaces, workspace, deps);
    })
  );
}

export async function removeAllDependencies(rootDir: string): Promise<void> {
  debug("removeAllDependencies", { rootDir });
  return removePackageJsonKeys(rootDir, ["dependencies", "devDependencies"]);
}
export async function removeUnnecessaryWorkspaces(
  rootDir: string,
  workspaces: Record<string, Workspace>,
  focusLocation: string
): Promise<void[]> {
  debug("removeUnnecessaryWorkspaces", { focusLocation, rootDir, workspaces });
  const focusPkgName = getFocusPackageNameFromLocation(
    workspaces,
    focusLocation
  );
  const internalDeps = listInternalWorkspaceDependencies(
    workspaces,
    focusPkgName
  );
  return Promise.all(
    Object.entries(workspaces)
      .filter(([packageName]) => focusPkgName !== packageName)
      .filter(([packageName]) => !internalDeps.has(packageName))
      .map(async ([, { location }]) =>
        removeAllDependencies(`${rootDir}/${location}`)
      )
  );
}

export async function removeWorkspacesDevDependencies(
  rootDir: string,
  workspaces: Record<string, Workspace>,
  focusLocation: string,
  { production } = { production: false }
): Promise<void[]> {
  debug("removeWorkspacesDevDependencies", {
    focusLocation,
    production,
    rootDir,
    workspaces,
  });
  return Promise.all(
    Object.entries(workspaces).map(async ([, { location }]) => {
      if (location === focusLocation) {
        if (!production) return;
        // remove focus workspace devDependencies too
      }
      await removePackageJsonKeys(`${rootDir}/${location}`, [
        "devDependencies",
      ]);
    })
  );
}

export async function removeAllNodeModules(
  rootDir: string,
  workspaces: Record<string, Workspace>
): Promise<void[]> {
  debug("removeAllNodeModules", {
    rootDir,
    workspaces,
  });
  return Promise.all([
    remove(`${rootDir}/node_modules`),
    ...Object.entries(workspaces).map(async ([, { location }]) =>
      remove(`${rootDir}/${location}/node_modules`)
    ),
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
  return Promise.all([
    move(`${tmp}/node_modules`, `${rootDir}/node_modules`),
    ...Object.entries(workspaces)
      .filter(([, { location }]) =>
        pathExistsSync(`${tmp}/${location}/node_modules`)
      )
      .map(async ([, { location }]) =>
        move(
          `${tmp}/${location}/node_modules`,
          `${rootDir}/${location}/node_modules`
        )
      ),
  ]);
}
