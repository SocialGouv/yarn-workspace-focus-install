beforeEach(() => {
  jest.resetModules();
});

test("should call system yarn command", async () => {
  const execa = jest.fn();
  jest.doMock("execa", () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: execa,
  }));
  const { yarnInstall } = await import("./yarn");

  const cwd = "/my/app";

  await yarnInstall(cwd);

  expect(execa).toHaveBeenCalledWith(
    "yarn",
    ["--frozen-lockfile", "--prefer-offline"],
    { cwd, stdio: "inherit" }
  );
});

test("should call yarn command with --cache-folder /dev/shm/yarn", async () => {
  const execa = jest.fn();
  jest.doMock("execa", () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    default: execa,
  }));
  const { yarnInstall } = await import("./yarn");

  const cwd = "/my/app";

  await yarnInstall(cwd, {}, ["--cache-folder", "/dev/shm/yarn"]);

  expect(execa).toHaveBeenCalledWith(
    "yarn",
    ["--cache-folder", "/dev/shm/yarn"],
    { cwd, stdio: "inherit" }
  );
});
