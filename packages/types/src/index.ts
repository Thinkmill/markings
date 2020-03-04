import * as BabelTypes from "@babel/types";

export type Marking = {
  location: {
    filename: string;
    line: number;
  };
  purpose: "rethink" | "question" | "addition" | "todo";
  details: string;
  heading: string;
};

export type Source = {
  type: "babel";
  extract: (file: BabelTypes.File) => Marking[];
};

export type Output = {
  getFile: (markings: Marking[]) => string;
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
