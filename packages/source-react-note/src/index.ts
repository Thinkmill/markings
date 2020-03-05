import { Source, Purpose, PURPOSES } from "@markings/types";
import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import { CodeFrameError } from "./code-frame-error";

let getValueFromJSXAttribute = (
  attribute: NodePath<t.JSXAttribute>,
  code: string
): string => {
  let value = attribute.get("value");
  if (value.isStringLiteral()) {
    return value.node.value;
  }
  if (value.isJSXExpressionContainer()) {
    let expression = value.get("expression");
    if (expression.isStringLiteral()) {
      return expression.node.value;
    }
  }
  throw new CodeFrameError(
    "attributes on the Note component must be string literals",
    attribute.node,
    code
  );
};

export const source: Source = {
  type: "babel",
  visitor: {
    JSXOpeningElement(path, { addMarking, filename, code }) {
      if (t.isJSXIdentifier(path.node.name) && path.node.name.name === "Note") {
        let details: string | undefined;
        let heading: string | undefined;
        let purpose: Purpose | undefined;

        for (let attribute of path.get("attributes")) {
          if (attribute.isJSXAttribute()) {
            if (attribute.node.name.name === "details") {
              details = getValueFromJSXAttribute(attribute, code);
            }
            if (attribute.node.name.name === "heading") {
              heading = getValueFromJSXAttribute(attribute, code);
            }
            if (attribute.node.name.name === "purpose") {
              purpose = getValueFromJSXAttribute(attribute, code);
              if (!PURPOSES.includes(purpose)) {
                throw new CodeFrameError(
                  `Purpose must be one of ${PURPOSES.join(", ")}`,
                  attribute.node,
                  code
                );
              }
            }
          } else {
            throw new CodeFrameError(
              "You cannot spread props on a Note component",
              attribute.node,
              code
            );
          }
        }
        if (purpose === undefined) {
          throw new CodeFrameError(
            "purpose must be passed to the Note component",
            path.node,
            code
          );
        }
        if (details === undefined) {
          throw new CodeFrameError(
            "details must be passed to the Note component",
            path.node,
            code
          );
        }
        addMarking({
          details,
          heading: heading || purpose,
          purpose,
          location: {
            filename,
            line: path.node.loc!.start.line
          }
        });
      }
    }
  }
  // TODO: implement source
};
