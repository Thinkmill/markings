import { Visitor } from "@babel/traverse";
import { TSESTree, TSESLint } from "@typescript-eslint/experimental-utils";

export const PURPOSES = ["question", "todo"] as const;

export type Purpose = typeof PURPOSES[number];

export type PartialMarking = {
  location: {
    line: number;
  };
  purpose: Purpose;
  description: string;
};

export type Marking = {
  location: {
    line: number;
    filename: string;
    link?: string;
  };
  purpose: Purpose;
  description: string;
  source: string;
  package: string;
  id: string;
};

export type Source = {
  type: "babel";
  visitor: Visitor<{
    addMarking: (marking: PartialMarking) => void;
  }>;
  eslint: (
    node: TSESTree.Program,
    report: (opts: {
      range: [number, number];
      fix: (
        fixer: TSESLint.RuleFixer
      ) =>
        | null
        | TSESLint.RuleFix
        | TSESLint.RuleFix[]
        | IterableIterator<TSESLint.RuleFix>;
    }) => void,
    getId: () => string
  ) => void;
};

export type Output = {
  getFile: (markings: Marking[]) => Promise<string> | string;
};

export type Config = {
  sources: {
    source: string;
    include: string[];
  }[];
  outputs: {
    output: string;
    filename: string;
  }[];
};
