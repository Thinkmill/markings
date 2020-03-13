// @flow
import * as logger from "./logger";
import fs from "fs-extra";
import nodePath from "path";
import { ExitError } from "./errors";
import {
  Config,
  Marking,
  Source,
  Output,
  PartialMarking
} from "@markings/types";
import mod from "module";
import globby from "globby";
import { ParserPlugin } from "@babel/parser";
import { transform, PluginObj } from "@babel/core";
import { getPackages, Package } from "@manypkg/get-packages";
// @ts-ignore
import { visitors as visitorsUtils, Visitor } from "@babel/traverse";
import parseGithubUrl from "parse-github-url";

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
  "optionalChaining",
  "decorators-legacy"
];

function getPackageFromFilename(
  repoRoot: string,
  filename: string,
  packagesByDirectory: Map<string, Package>
) {
  let currentDir = nodePath.dirname(filename);
  while (currentDir !== repoRoot) {
    let maybeCurrentPackage = packagesByDirectory.get(currentDir);
    if (maybeCurrentPackage !== undefined) {
      return maybeCurrentPackage;
    }
    currentDir = nodePath.dirname(currentDir);
  }
  throw new Error(`could not find package from ${JSON.stringify(filename)}`);
}

(async (cwd = process.cwd()) => {
  let args = process.argv.slice(2);
  let packagesPromise = getPackages(cwd);
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

  let sourcesByFilename = new Map<string, Set<string>>();

  let addBabelSourceToFile = (filename: string, source: string) => {
    if (!sourcesByFilename.has(filename)) {
      sourcesByFilename.set(filename, new Set());
    }
    let sources = sourcesByFilename.get(filename)!;
    sources.add(source);
  };

  await Promise.all(
    config.sources.map(async sourceConfig => {
      let result = await globby(sourceConfig.include, {
        cwd,
        absolute: true,
        ignore: ["**/node_modules/**/*"]
      });

      for (let filename of result) {
        if (/\.[jt]sx?$/.test(filename) && !/\.d\.ts$/.test(filename)) {
          addBabelSourceToFile(filename, sourceConfig.source);
        }
      }
    })
  );
  let pkgs = await packagesPromise;
  let getUrl = (filename: string, line: number): string | undefined => {
    return;
  };
  if (typeof (pkgs.root.packageJson as any).repository === "string") {
    const parsed = parseGithubUrl((pkgs.root.packageJson as any).repository);
    if (parsed !== null && parsed.host === "github.com") {
      getUrl = (filename, line) => {
        return `https://github.com/${parsed.owner}/${parsed.name}/blob/master/${filename}#L${line}`;
      };
    }
  }
  let packagesByDirectory = new Map(pkgs.packages.map(x => [x.dir, x]));
  // TODO: do extraction work in worker threads
  await Promise.all(
    [...sourcesByFilename.entries()].map(async ([filename, sources]) => {
      let visitorsArray = [...sources].map(x => req(x).source.visitor);

      let visitor: Visitor = visitorsUtils.merge(
        visitorsArray,
        [...sources].map(source => ({
          addMarking: (marking: PartialMarking) => {
            markings.push({
              location: {
                line: marking.location.line,
                filename,
                link: getUrl(
                  nodePath.relative(pkgs.root.dir, filename),
                  marking.location.line
                )
              },
              description: marking.description,
              source: source,
              package: getPackageFromFilename(
                pkgs.root.dir,
                filename,
                packagesByDirectory
              ).packageJson.name,
              purpose: marking.purpose
            });
          }
        }))
      );
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
              visitor
            };
          }
        ]
      });
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
