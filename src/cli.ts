const execa = require("execa");
const assert = require("assert");
const fs = require("fs-extra");
const path = require("path");
const findWorkspaceRoot = require("find-yarn-workspace-root");

main(require("yargs-parser")(process.argv.slice(2))).catch(console.error);

async function main(options) {
  const { production, dryRun } = options;
  const cwd = process.cwd();
  const tmp = await getTmpFolder();
  const workspaces = await getWorkspaces();
  const workspaceRoot = findWorkspaceRoot(cwd);

  assert(cwd !== workspaceRoot);

  await Promise.all([
    fs.copy(`${workspaceRoot}/package.json`, `${tmp}/package.json`),
    fs.copy(`${workspaceRoot}/yarn.lock`, `${tmp}/yarn.lock`),
  ]);

  await Promise.all(
    Object.entries(workspaces).map(([, { location }]) =>
      fs.copy(
        `${workspaceRoot}/${location}/package.json`,
        `${tmp}/${location}/package.json`
      )
    )
  );

  await removeUnnecessaryWorkspaces(tmp, workspaces, path.basename(cwd));

  await Promise.all([
    removeWorkspacesDevDependencies(tmp, workspaces, path.basename(cwd), {
      production,
    }),
    removeAllDependencies(tmp),
  ]);

  // console.info(
  //   `yarn --cwd ${path.relative(workspaceRoot, cwd)} install --focus ${
  //     production ? "--production" : ""
  //   }`
  // );
  await yarnInstall(tmp);

  if (dryRun) {
    console.info("[dryRun mode] Focus installation done in " + tmp);
    return;
  }

  await removeAllNodeModules(workspaceRoot, workspaces);
  await transferAllNodeModules(tmp, workspaceRoot, workspaces);

  await fs.rmdir(`${tmp}`, { recursive: true });
}

async function removeAllNodeModules(rootDir, workspaces) {
  return Promise.all([
    fs.rmdir(`${rootDir}/node_modules`, { recursive: true }),
    ...Object.entries(workspaces).map(([, { location }]) =>
      fs.rmdir(`${rootDir}/${location}/node_modules`, { recursive: true })
    ),
  ]);
}
async function transferAllNodeModules(tmp, rootDir, workspaces) {
  return Promise.all([
    fs.move(`${tmp}/node_modules`, `${rootDir}/node_modules`),
    ...Object.entries(workspaces)
      .filter(([, { location }]) =>
        fs.pathExistsSync(`${tmp}/${location}/node_modules`)
      )
      .map(([, { location }]) =>
        fs.move(
          `${tmp}/${location}/node_modules`,
          `${rootDir}/${location}/node_modules`
        )
      ),
  ]);
}
async function getWorkspaces() {
  const { stdout } = await execa("yarn", [
    "--silent",
    "workspaces",
    "--json",
    "info",
  ]);
  const { data } = JSON.parse(stdout);
  return JSON.parse(data);
}

function getFocusPackageNameFromLocation(workspaces, focusLocation) {
  const [name] = Object.entries(workspaces).find(
    ([, { location }]) => location === focusLocation
  );
  return name;
}
async function getTmpFolder() {
  const { stdout } = await execa("mktemp", ["-d"]);
  return stdout;
}

function listInternalWorkspaceDependencies(
  workspaces,
  focusLocation,
  dependencies = new Set()
) {
  const { workspaceDependencies } = workspaces[focusLocation];
  if (!workspaceDependencies.length) {
    return dependencies;
  }

  const deps = uniqueUnion(dependencies, workspaceDependencies);

  return uniqueUnion(
    ...workspaceDependencies.map((workspace) => {
      return listInternalWorkspaceDependencies(workspaces, workspace, deps);
    })
  );
}

function uniqueUnion(...iterables) {
  const set = new Set();
  for (let iterable of iterables) {
    for (let item of iterable) {
      set.add(item);
    }
  }

  return set;
}

async function removeUnnecessaryWorkspaces(rootDir, workspaces, focusLocation) {
  const focusPkgName = getFocusPackageNameFromLocation(
    workspaces,
    focusLocation
  );
  const internalDeps = listInternalWorkspaceDependencies(
    workspaces,
    focusPkgName
  );
  return Promise.all(
    Object.entries(workspaces)
      .filter(([packageName]) => !internalDeps.has(packageName))
      .map(([, { location }]) =>
        removeAllDependencies(`${rootDir}/${location}`)
      )
  );
}

async function removeWorkspacesDevDependencies(
  rootDir,
  workspaces,
  focusLocation,
  { production } = {}
) {
  return Promise.all(
    Object.entries(workspaces).map(([, { location }]) => {
      if (location === focusLocation) {
        if (!production) return;
        // remove focus workspace devDependencies too
      }
      return removePackageJsonKeys(`${rootDir}/${location}`, [
        "devDependencies",
      ]);
    })
  );
}

async function removeAllDependencies(rootDir) {
  return removePackageJsonKeys(rootDir, ["dependencies", "devDependencies"]);
}

async function removePackageJsonKeys(cwd, keys) {
  const package = await fs.readJson(`${cwd}/package.json`);
  const json = keys.reduce((memo, key) => {
    const { [key]: _value, ...rest } = memo;
    return rest;
  }, package);
  await fs.outputJson(`${cwd}/package.json`, json);
}

async function yarnInstall(cwd) {
  await execa("yarn", ["--frozen-lockfile", "--prefer-offline"], {
    stdio: "inherit",
    cwd: cwd,
  });
}
