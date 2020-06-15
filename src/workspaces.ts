import assert from "assert";
import { move, pathExistsSync, remove } from "fs-extra";

import { removePackageJsonKeys } from "./pkg";
import { uniqueUnion } from "./utils";

export interface Workspace {
  location: string;
  workspaceDependencies: string[];
}

export function getFocusPackageNameFromLocation(
  workspaces: Record<string, Workspace>,
  focusLocation: string
): string {
  const [name] =
    Object.entries(workspaces).find(
      ([, { location }]) => location === focusLocation
    ) ?? [];

  assert(name, `${focusLocation} is not in the workspace tree`);

  return name;
}

export function listInternalWorkspaceDependencies(
  workspaces: Record<string, Workspace>,
  name: string,
  dependencies = new Set<string>()
): Set<string> {
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
  return removePackageJsonKeys(rootDir, ["dependencies", "devDependencies"]);
}
export async function removeUnnecessaryWorkspaces(
  rootDir: string,
  workspaces: Record<string, Workspace>,
  focusLocation: string
): Promise<void[]> {
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
