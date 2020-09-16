import { Source, RecordOfPurposes } from "@markings/types";
import * as BabelTypes from "@babel/types";

let commentPurposes: RecordOfPurposes = {
  TODO: "todo",
  FIXME: "fixme",
  QUESTION: "question"
};
let commentTypes = Object.keys(commentPurposes);

export const source: Source = {
  type: "babel",
  visitor: {
    Program(path, { addMarking }) {
      let comments: BabelTypes.Comment[] = (path.parent as BabelTypes.File)
        .comments;
      for (let comment of comments) {
        if (comment.type === "CommentLine") {
          let value = comment.value.trim();
          let match = value.match(/([^:]+):(.+)/);
          if (match !== null && commentTypes.includes(match[1])) {
            addMarking({
              description: match[2].trim(),
              purpose: commentPurposes[match[1]],
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
