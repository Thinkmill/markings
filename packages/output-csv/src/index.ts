import stringifyToCsv from "csv-stringify/lib/sync";
import { Output } from "@markings/types";

export const output: Output = {
  getFile(markings) {
    return stringifyToCsv(
      markings.map(({ location, ...x }) => ({
        ...x,
        filename: location.filename
      })),
      { header: true }
    );
  }
};
