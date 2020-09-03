import parser from "yargs-parser";

import { focusInstall } from "./install";

const { cwd, dryRun, production, _: args } = parser(process.argv.slice(2));
const yarnArgs = args as string[];

focusInstall({ cwd, dryRun, production, yarnArgs }).catch((e) => {
  console.error(e);
  process.exit(1);
});
