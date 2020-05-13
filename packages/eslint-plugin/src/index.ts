import {
  ESLintUtils,
  TSESTree,
  TSESLint,
} from "@typescript-eslint/experimental-utils";
import fs from "fs";
import { sync as findUpSync } from "find-up";

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/Thinkmill/markings/blob/master/packages/eslint-plugin/docs/rules/${name}.md`
);

function findMarkingsConfig(cwd: string) {
  findUpSync(
    (directory) => {
        try {
            let json = JSON.parse(
                fs.readFileSync(path.join(directory, "package.json"))
              );
        }
     
    },
    { cwd }
  );
}

export const rules = {
  comment: createRule({
    name: "comment",
    meta: {
      type: "problem",
      docs: {
        category: "Possible Errors",
        recommended: "error",
        description: "",
      },
      messages: {},
      fixable: "code",
      schema: [],
    },
    defaultOptions: [],
    create(context) {
      return {
        Program(node) {},
      };
    },
  }),
};
