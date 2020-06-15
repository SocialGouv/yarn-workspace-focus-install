import { outputJson, readJson } from "fs-extra";

export async function removePackageJsonKeys(
  cwd: string,
  keys: string[]
): Promise<void> {
  const pkg: Record<string, string> = await readJson(`${cwd}/package.json`);
  const json = keys.reduce((memo, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _value, ...rest } = memo;
    return rest;
  }, pkg);
  await outputJson(`${cwd}/package.json`, json);
}
