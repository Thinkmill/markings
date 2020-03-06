import { Source } from "@markings/types";
import * as BabelTypes from "@babel/types";

let commentTypes = ["TODO", "FIXME", "QUESTION"];

export const source: Source = {
  type: "babel",
  visitor: {
    Program(path, { addMarking }) {
      let comments: BabelTypes.Comment[] = (path.parent as BabelTypes.File)
        .comments;
      for (let comment of comments) {
        if (comment.type === "CommentLine") {
          let value = comment.value.trim();
          let match = value.match(/([^:]+)(.+)/);
          if (match !== null && commentTypes.includes(match[1])) {
            addMarking({
              details: match[2],
              purpose: match[1] === "QUESTION" ? "question" : "todo",
              heading: ({
                TODO: "Todo",
                FIXME: "Fixme",
                QUESTION: "Question"
              } as any)[match[1]] as string,
              location: {
                line: comment.loc.start.line
              }
            });
          }
        } else {
          // TODO: source from block comments(potentially with a jsdoc style) too
        }
      }
    }
  }
};
