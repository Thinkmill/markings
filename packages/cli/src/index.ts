// @flow
import * as logger from "./logger";
import fs from "fs-extra";
import path from "path";
import { ExitError } from "./errors";
import pLimit from "p-limit";

(async () => {
  let args = process.argv.slice(2);
})().catch(err => {
  if (err instanceof ExitError) {
    process.exit(err.code);
  } else {
    logger.error(err);
    process.exit(1);
  }
});
