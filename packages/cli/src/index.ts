// @flow
import * as logger from "./logger";
import fs from "fs-extra";
import path from "path";
import { ExitError } from "./errors";
import pLimit from "p-limit";
import { Config, Marking, Source, Output } from "@markings/types";
import mod from "module";
import globby from "globby";
import { parse, ParserPlugin } from "@babel/parser";
import traverse from "@babel/traverse";

let parserPlugins: ParserPlugin[] = [
  "asyncGenerators",
  "bigInt",
  "classPrivateMethods",
  "classProperties",
  "doExpressions",
  "dynamicImport",
  "importMeta",
  "jsx",
  "topLevelAwait",
  "throwExpressions",
  "nullishCoalescingOperator",
  "optionalChaining"
];

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
    ? mod.createRequire(path.join(cwd, "package.json"))
    : mod.createRequireFromPath(path.join(cwd, "package.json"));

  let markings: Marking[] = [];

  // TODO: use workers for all the things
  await Promise.all(
    config.sources.map(async sourceConfig => {
      let result = await globby(sourceConfig.include, { cwd, absolute: true });
      let plugin: Source = req(sourceConfig.source).source;
      // TODO: limit the things
      await Promise.all(
        result.map(async filename => {
          let contents = await fs.readFile(filename, "utf8");
          let ast = parse(contents, {
            sourceFilename: filename,
            plugins: parserPlugins.concat(
              /\.tsx?$/.test(filename) ? "typescript" : "flow"
            ),
            sourceType: "unambiguous"
          });
          traverse(ast, plugin.visitor, undefined, {
            addMarking: marking => {
              markings.push(marking);
            },
            filename: path.relative(cwd, filename),
            code: contents
          });
        })
      );
    })
  );
  await Promise.all(
    config.outputs.map(async outputConfig => {
      let plugin: Output = req(outputConfig.output).output;
      let output = await plugin.getFile(markings);
      await fs.writeFile(outputConfig.filename, output);
    })
  );
})().catch(err => {
  console.log("yes");
  if (err instanceof ExitError) {
    process.exit(err.code);
  } else {
    logger.error(err);
    process.exit(1);
  }
});
