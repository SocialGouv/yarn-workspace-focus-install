import { ok } from "assert";
import Debug from "debug";

import { listDependencies } from "./listDependencies";
import type { Workspace } from "./types";

const debug = Debug(
  "yarn-workspace-focus-install:workspaces:unnecessaryDependencies"
);

export function unnecessaryDependencies(
  workspaces: Record<string, Workspace>,
  workspaceName: string
): Record<string, Workspace> {
  debug({
    workspaceName,
    workspaces,
  });

  ok(workspaces[workspaceName], `${workspaceName} workspace not found`);

  const internalDeps = listDependencies(workspaces, workspaceName);
  return Object.entries(workspaces)
    .filter(([packageName]) => workspaceName !== packageName)
    .filter(([packageName]) => !internalDeps.has(packageName))
    .reduce((memo, [key, value]) => ({ ...memo, [key]: value }), {});
}
