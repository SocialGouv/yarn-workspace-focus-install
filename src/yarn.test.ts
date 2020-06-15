import execa from "execa";

import { yarnInstall } from "./yarn";

jest.mock("execa");

test.concurrent("should call system yarn command", async () => {
  const cwd = "/my/app";

  await yarnInstall(cwd);

  expect(execa).toHaveBeenCalledWith(
    "yarn",
    ["--frozen-lockfile", "--prefer-offline"],
    { cwd, stdio: "inherit" }
  );
});
