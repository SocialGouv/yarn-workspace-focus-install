import Debug from "debug";

import { removeKeys } from "./removeKeys";

const debug = Debug("yarn-workspace-focus-install:pkg:removeAllDependencies");
export async function removeAllDependencies(rootDir: string): Promise<void> {
  debug({ rootDir });
  return removeKeys(rootDir, ["dependencies", "devDependencies"]);
}
