import execa from "execa";
import { directory } from "tempy";

import { yarnInstall } from "./yarn";

jest.mock("execa");
test.concurrent("should call system yarn command", async () => {
  const cwd = directory();
  await yarnInstall(cwd);
  expect(execa).toHaveBeenCalledWith(
    "yarn",
    ["--frozen-lockfile", "--prefer-offline"],
    { cwd, stdio: "inherit" }
  );
});
