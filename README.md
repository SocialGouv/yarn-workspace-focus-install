<h1 align="center">
  <img src="https://github.com/SocialGouv/yarn-workspace-focus-install/raw/master/.github/yarn.png" width="250"/>
  <p align="center">Yarn Workspace Focus Install</p>
  <p align="center" style="font-size: 0.5em">Install one and only workspace</p>
</h1>

<p align="center">
  <a href="https://github.com/SocialGouv/yarn-workspace-focus-install/actions/"><img src="https://github.com/SocialGouv/yarn-workspace-focus-install/workflows/ci/badge.svg" alt="Github Master CI Status"></a>
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache--2.0-yellow.svg" alt="License: Apache-2.0"></a>
  <a href="https://www.npmjs.com/package/@socialgouv/yarn-workspace-focus-install"><img src="https://img.shields.io/npm/v/@socialgouv/yarn-workspace-focus-install.svg" alt="Npm version"></a>
  <a href="https://codecov.io/gh/SocialGouv/yarn-workspace-focus-install"><img src="https://codecov.io/gh/SocialGouv/yarn-workspace-focus-install/branch/master/graph/badge.svg" alt="codecov"></a>
</p>

<br>
<br>
<br>
<br>

## Problem

In a yarn v1 monorepo one does not simply install one workspace.

<br>
<br>
<br>
<br>

## Solution

```sh
$ npx yarn-workspace-focus-install # in packages/foo
# or
$ npx yarn-workspace-focus-install --cwd packages/foo
```

<br>
<br>
<br>
<br>

## Installation

```sh
$ yarn add -D yarn-workspace-focus-install
$ npx yarn-workspace-focus-install --cwd packages/foo
```

<br>
<br>
<br>
<br>

## Usage

```sh
$ yarn add -D yarn-workspace-focus-install
# Focus install packages/foo
$ npx yarn-workspace-focus-install --cwd packages/foo
# Focus install packages/foo without its devDependencies
$ npx yarn-workspace-focus-install --cwd packages/foo --production
# Fake focus install packages/foo
$ npx yarn-workspace-focus-install --cwd packages/foo --dry-run
# Focus install packages/foo pass `--cache-folder /dev/shm/yarn` to yarn
$ npx yarn-workspace-focus-install --cwd packages/foo -- --cache-folder /dev/shm/yarn
```

<br>
<br>
<br>
<br>

## Inspiration

- Workspaces : https://classic.yarnpkg.com/en/docs/workspaces/
- `yarn workspaces focus` : https://yarnpkg.com/cli/workspaces/focus

<br>
<br>
<br>
<br>

## [License Apache-2.0](./LICENSE)
