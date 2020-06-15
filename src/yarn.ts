import execa, { ExecaReturnValue, Options } from "execa";

import { Workspace } from "./workspaces";

export async function yarnInstall(
  cwd: string,
  options: Options = {}
): Promise<ExecaReturnValue> {
  return execa("yarn", ["--frozen-lockfile", "--prefer-offline"], {
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
