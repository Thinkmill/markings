import { Visitor } from "@babel/traverse";

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
};

export type Source = {
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
