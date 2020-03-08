import { Visitor } from "@babel/traverse";

export const PURPOSES = ["rethink", "question", "addition", "todo"];

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
  };
  purpose: Purpose;
  description: string;
  source: string;
  package: string;
};

export type Source = {
  name: string;
  type: "babel";
  visitor: Visitor<{
    addMarking: (marking: PartialMarking) => void;
  }>;
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
