import assert from "assert";
import Debug from "debug";
import slash from "slash";

import type { Workspace } from "./types";

const debug = Debug("yarn-workspace-focus-install:workspace:nameFromLocation");

export function nameFromLocation(
  workspaces: Record<string, Workspace>,
  focusLocation: string
): string {
  debug({ focusLocation, workspaces });
  const unixFocusLocation = slash(focusLocation);
  const [name] =
    Object.entries(workspaces).find(
      ([, { location }]) => location === unixFocusLocation
    ) ?? [];
  assert(name, `${unixFocusLocation} is not in the workspace tree`);
  return name;
}
