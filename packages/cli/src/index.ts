// @flow
import * as logger from "./logger";
import fs from "fs-extra";
import nodePath from "path";
import { ExitError } from "./errors";
import { Config, Marking, Source, Output } from "@markings/types";
import mod from "module";
import globby from "globby";
import { ParserPlugin } from "@babel/parser";
import { transform, PluginObj } from "@babel/core";

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
  let packageJsonContent = await fs.readJson(
    nodePath.join(cwd, "package.json")
  );
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
    ? mod.createRequire(nodePath.join(cwd, "package.json"))
    : mod.createRequireFromPath(nodePath.join(cwd, "package.json"));

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
          transform(contents, {
            code: false,
            configFile: false,
            babelrc: false,
            filename,
            sourceRoot: cwd,
            filenameRelative: nodePath.relative(cwd, filename),
            parserOpts: {
              plugins: parserPlugins.concat(
                /\.tsx?$/.test(filename) ? "typescript" : "flow"
              )
            },
            plugins: [
              (): PluginObj => {
                return {
                  visitor: {
                    Program(path) {
                      path.traverse(plugin.visitor, {
                        addMarking: marking => {
                          markings.push(marking);
                        },
                        filename: nodePath.relative(cwd, filename),
                        code: contents
                      });
                    }
                  }
                };
              }
            ]
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
