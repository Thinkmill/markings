import { Visitor } from "@babel/traverse";

export const PURPOSES = ["rethink", "question", "addition", "todo"];

export type Purpose = typeof PURPOSES[number];

export type Marking = {
  location: {
    filename: string;
    line: number;
  };
  purpose: Purpose;
  details: string;
  heading: string;
};

export type Source = {
  type: "babel";
  visitor: Visitor<{
    addMarking: (marking: Marking) => void;
    filename: string;
    code: string;
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
