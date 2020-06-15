import { uniqueUnion } from "../utils";
import { debug } from "../workspaces";
import { Workspace } from "./types";

export function listDependencies(
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
      return listDependencies(workspaces, workspace, deps);
    })
  );
}
