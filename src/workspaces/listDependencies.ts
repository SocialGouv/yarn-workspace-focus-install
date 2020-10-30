import Debug from "debug";

import { uniqueUnion } from "../utils";
import type { Workspace } from "./types";

const debug = Debug("yarn-workspace-focus-install:workspace:listDependencies");

export function listDependencies(
  workspaces: Record<string, Workspace>,
  name: string,
  dependencies = new Set<string>()
): Set<string> {
  debug({
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
      return listDependencies(workspaces, workspace, deps);
    })
  );
}
