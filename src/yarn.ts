import Debug from "debug";
import type { ExecaReturnValue, Options } from "execa";
import execa from "execa";

import type { Workspace } from "./workspaces/types";

const debug = Debug("yarn-workspace-focus-install:yarn");

export async function yarnInstall(
  cwd: string,
  options: Options = {},
  yarnArgs: string[] = ["--prefer-offline"]
): Promise<ExecaReturnValue> {
  debug("yarn", [...yarnArgs], {
    cwd: cwd,
    stdio: "inherit",
    ...options,
  });
  return execa("yarn", ["--frozen-lockfile", ...yarnArgs], {
    cwd: cwd,
    stdio: "inherit",
    ...options,
  });
}

export async function getWorkspaces(): Promise<Record<string, Workspace>> {
  const { stdout } = await execa("yarn", [
    "--silent",
    "workspaces",
    "--json",
    "info",
  ]);
  const { data } = JSON.parse(stdout);
  return JSON.parse(data) as Record<string, Workspace>;
}
