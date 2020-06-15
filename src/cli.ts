import parser from "yargs-parser";

import { install } from "./install";

const { cwd, dryRun, production } = parser(process.argv.slice(2));

install({ cwd, dryRun, production }).catch(console.error);
