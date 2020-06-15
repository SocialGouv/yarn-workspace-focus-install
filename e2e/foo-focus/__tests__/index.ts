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
test("should focus install foo package", async () => {
  await copy(join(__dirname, ".."), cwd);
  const { stdout, stderr } = await node(BIN, {
    cwd: join(cwd, "packages", "foo"),
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
  expect(await pathExists(join(cwd, "packages", "a"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "b"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "c"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "c1"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "c2"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "c21"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "d"))).toBeTruthy();
  expect(await pathExists(join(cwd, "packages", "foo"))).toBeTruthy();

  expect(await pathExists(join(cwd, "node_modules"))).toBeTruthy();
  // package dependencies should be installed
  expect(
    await pathExists(join(cwd, "node_modules", "remove-trailing-separator"))
  ).toBeTruthy();
  // package dev dependencies should be installed
  expect(
    await pathExists(join(cwd, "node_modules", "replace-ext"))
  ).toBeTruthy();

  expect(await pathExists(join(cwd, "node_modules", "a"))).toBeTruthy();
  // Sub package dev dependencies should not be installed
  expect(await pathExists(join(cwd, "node_modules", "through"))).toBeFalsy();

  expect(await pathExists(join(cwd, "node_modules", "b"))).toBeTruthy();
  // Sub package dependencies should be installed
  expect(await pathExists(join(cwd, "node_modules", "slash"))).toBeTruthy();

  expect(await pathExists(join(cwd, "node_modules", "c"))).toBeTruthy();
  expect(await pathExists(join(cwd, "node_modules", "c1"))).toBeTruthy();
  expect(await pathExists(join(cwd, "node_modules", "c2"))).toBeTruthy();
  expect(await pathExists(join(cwd, "node_modules", "c21"))).toBeTruthy();
  // Deep sub package dependencies should be installed
  expect(
    await pathExists(join(cwd, "node_modules", "signal-exit"))
  ).toBeTruthy();

  expect(await pathExists(join(cwd, "node_modules", "d"))).toBeTruthy();
  // Other package dependencies should not be installed
  expect(await pathExists(join(cwd, "node_modules", "semver"))).toBeFalsy();

  expect(await pathExists(join(cwd, "node_modules", "foo"))).toBeTruthy();

  expect(await pathExists(join(cwd, "package.json"))).toBeTruthy();
  expect(await pathExists(join(cwd, "yarn.lock"))).toBeTruthy();
}, 10_000);
