import parser from "yargs-parser";

import { focusInstall } from "./install";

const { cwd, dryRun, production } = parser(process.argv.slice(2));

focusInstall({ cwd, dryRun, production }).catch(console.error);
