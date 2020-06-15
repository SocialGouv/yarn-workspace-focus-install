import Debug from "debug";
import { outputJson, readJson } from "fs-extra";
import { join } from "path";

const debug = Debug("yarn-workspace-focus-install:pkg");
export async function removeKeys(cwd: string, keys: string[]): Promise<void> {
  const packageFile = join(cwd, "package.json");
  debug({ cwd, keys, packageFile });

  const pkg: Record<string, string> = await readJson(packageFile);

  const json = keys.reduce((memo, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _value, ...rest } = memo;
    return rest;
  }, pkg);

  await outputJson(packageFile, json);
}
