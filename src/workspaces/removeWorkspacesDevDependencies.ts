import { removeKeys } from "../pkg/removeKeys";
import { debug } from "../workspaces";
import { Workspace } from "./types";

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
      await removeKeys(`${rootDir}/${location}`, ["devDependencies"]);
    })
  );
}
