import { Node } from "@babel/types";
import { codeFrameColumns } from "@babel/code-frame";

export class CodeFrameError extends Error {
  constructor(message: string, node: Node, code: string) {
    let loc = node.loc!;
    super(
      message +
        "\n" +
        codeFrameColumns(
          code,
          {
            start: {
              line: loc.start.line,
              column: loc.start.column + 1
            },
            end:
              loc.end && loc.start.line === loc.end.line
                ? {
                    line: loc.end.line,
                    column: loc.end.column + 1
                  }
                : undefined
          },
          { highlightCode: true }
        )
    );
  }
}
