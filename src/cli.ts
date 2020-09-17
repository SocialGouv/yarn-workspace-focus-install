import parser from "yargs-parser";

import { focusInstall } from "./install";

const { cwd, dryRun, production, _: yarnArgs } = parser(process.argv.slice(2));

focusInstall({ cwd, dryRun, production, yarnArgs }).catch((e) => {
  console.error(e);
  process.exit(1);
});
