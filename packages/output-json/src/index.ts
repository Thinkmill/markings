import { Output } from "@markings/types";

export const output: Output = {
  getFile(markings) {
    return JSON.stringify(markings, null, 2);
  }
};
