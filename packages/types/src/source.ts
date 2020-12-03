// this is in a different entrypoint because importing the Babel types is EXPENSIVE(I've seen it take ~10 seconds to type check)
// and it's not providing value to people who aren't writing their own source
// but the main entrypoint will be used

import { PartialMarking } from ".";
import { Visitor } from "@babel/traverse";

export type Source = {
  type: "babel";
  visitor: Visitor<{
    addMarking: (marking: PartialMarking) => void;
  }>;
};
