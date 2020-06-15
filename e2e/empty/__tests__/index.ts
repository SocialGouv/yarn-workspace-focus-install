import { node } from "execa";
import { copy, pathExists, readFileSync, remove } from "fs-extra";
import { join } from "path";
import { directory } from "tempy";

import { bin } from "../../../package.json";

const BIN = join(__dirname, "..", "..", "..", bin);
const cwd = directory();
const yarnInstallLog = readFileSync(join(__dirname, "yarn-install.out"))
  .toString("utf-8")
  .trim();
afterAll(async () => {
  await remove(cwd);
});
test("should do nothing", async () => {
  await copy(join(__dirname, ".."), cwd);
  const { stdout, stderr } = await node(BIN, {
    cwd: join(cwd, "packages", "dummy"),
    env: {
      /* eslint-disable @typescript-eslint/naming-convention */
      FORCE_COLOR: "0",
    },
  });

  expect({ stderr, stdout }).toStrictEqual({
    stderr: "",
    stdout: yarnInstallLog,
  });

  expect(await pathExists(join(cwd, "packages"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "dummy"))).toBeTruthy();

  expect(await pathExists(join(cwd, "node_modules"))).toBeTruthy();
  expect(await pathExists(join(cwd, "node_modules", "dummy"))).toBeTruthy();

  expect(await pathExists(join(cwd, "package.json"))).toBeTruthy();
  expect(await pathExists(join(cwd, "yarn.lock"))).toBeTruthy();
});
