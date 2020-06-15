import { Workspace } from "./types";

export function mapLocations<T>(
  workspaces: Record<string, Workspace>,
  fn: (location: string) => T
): T[] {
  return Object.entries(workspaces).map(([, { location }]) => fn(location));
}
