import { join } from "path";

import { removeAllDependencies } from "../pkg/removeAllDependencies";
import { debug } from "../workspaces";
import { getFocusPackageNameFromLocation } from "./getPackageNameFromLocation";
import { listDependencies } from "./listDependencies";
import { Workspace } from "./types";

export async function removeUnnecessaryDependencies(
  rootDir: string,
  workspaces: Record<string, Workspace>,
  focusLocation: string
): Promise<void[]> {
  debug("removeUnnecessaryWorkspaces", { focusLocation, rootDir, workspaces });
  const focusPkgName = getFocusPackageNameFromLocation(
    workspaces,
    focusLocation
  );
  const internalDeps = listDependencies(workspaces, focusPkgName);
  return Promise.all(
    Object.entries(workspaces)
      .filter(([packageName]) => focusPkgName !== packageName)
      .filter(([packageName]) => !internalDeps.has(packageName))
      .map(async ([, { location }]) =>
        removeAllDependencies(join(rootDir, location))
      )
  );
}
