// @flow
import * as logger from "./logger";
import fs from "fs-extra";
import path from "path";
import { ExitError } from "./errors";
import pLimit from "p-limit";
import { Config } from "@markings/types";
import mod from "module";

(async (cwd = process.cwd()) => {
  let args = process.argv.slice(2);
  let packageJsonContent = await fs.readJson(path.join(cwd, "package.json"));
  let config: Config | undefined = packageJsonContent.markings;
  if (!config) {
    logger.error("please configure markings before using the cli");
    throw new ExitError(1);
  }
  if (!config.sources.length) {
    logger.error("please add a marking source before using the cli");
    throw new ExitError(1);
  }
  if (!config.sources.length) {
    logger.error("please add a marking output before using the cli");
    throw new ExitError(1);
  }

  const req = mod.createRequire
    ? mod.createRequire(cwd)
    : mod.createRequireFromPath(cwd);

  config.sources.forEach(() => {});
})().catch(err => {
  if (err instanceof ExitError) {
    process.exit(err.code);
  } else {
    logger.error(err);
    process.exit(1);
  }
});
