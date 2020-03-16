import jestInCase from "jest-in-case";
import * as babel from "@babel/core";
import { Source, PartialMarking } from "@markings/types";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { PluginObj } from "@babel/core";
// @ts-ignore
import { visitors as visitorsUtils, Visitor } from "@babel/traverse";

const readFile = promisify(fs.readFile);

const separator = "\n      ↓ ↓ ↓ ↓ ↓ ↓\n\n";

expect.addSnapshotSerializer({
  test: x => x && x.___raw,
  serialize: val => val.___raw
});

let parserPlugins = [
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
] as const;

function getFixtures(dirname: string) {
  const fixturesFolder = path.join(dirname, "__fixtures__");
  return fs
    .readdirSync(fixturesFolder)
    .map(base => path.join(fixturesFolder, base));
}

export const snapshotMarkingsFromFixtures = (
  dirname: string,
  source: Source
) => {
  let cases = getFixtures(dirname).reduce((accum, filename) => {
    let skip = false;
    let only = false;
    let testTitle = filename;
    if (filename.indexOf(".skip") !== -1) {
      testTitle = filename.replace(".skip", "");
      skip = true;
    } else if (filename.indexOf(".only") !== -1) {
      testTitle = filename.replace(".only", "");
      only = true;
    }
    accum[path.parse(testTitle).name] = {
      filename,
      only,
      skip
    };
    return accum;
  }, {} as any);

  return jestInCase(
    name,
    async (opts: { filename: string }) => {
      let code = await readFile(opts.filename, "utf-8");

      let markings: PartialMarking[] = [];

      let visitor: Visitor = visitorsUtils.merge(
        [source.visitor],
        [
          {
            addMarking: (marking: PartialMarking) => {
              markings.push(marking);
            }
          }
        ]
      );
      babel.transformSync(code, {
        code: false,
        configFile: false,
        babelrc: false,
        filename: opts.filename,
        parserOpts: {
          plugins: parserPlugins.concat(
            // @ts-ignore
            /\.tsx?$/.test(opts.filename) ? "typescript" : "flow"
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

      expect({
        ___raw: `${code}${separator}${JSON.stringify(markings, null, 2)}`
      }).toMatchSnapshot();
    },
    cases
  );
};
