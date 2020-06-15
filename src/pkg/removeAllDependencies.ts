import { debug } from "../workspaces";
import { removeKeys } from "./removeKeys";

export async function removeAllDependencies(rootDir: string): Promise<void> {
  debug("removeAllDependencies", { rootDir });
  return removeKeys(rootDir, ["dependencies", "devDependencies"]);
}
