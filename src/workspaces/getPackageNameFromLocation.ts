import assert from "assert";
import slash from "slash";

import { debug } from "../workspaces";
import { Workspace } from "./types";

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
