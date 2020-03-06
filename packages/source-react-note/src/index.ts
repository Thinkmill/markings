import { Source, Purpose, PURPOSES } from "@markings/types";
import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";

let getValueFromJSXAttribute = (
  attribute: NodePath<t.JSXAttribute>
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
  throw attribute.buildCodeFrameError(
    "attributes on the Note component must be string literals"
  );
};

export const source: Source = {
  type: "babel",
  visitor: {
    JSXOpeningElement(path, { addMarking }) {
      if (t.isJSXIdentifier(path.node.name) && path.node.name.name === "Note") {
        let details: string | undefined;
        let heading: string | undefined;
        let purpose: Purpose | undefined;

        for (let attribute of path.get("attributes")) {
          if (attribute.isJSXAttribute()) {
            if (attribute.node.name.name === "details") {
              details = getValueFromJSXAttribute(attribute);
            }
            if (attribute.node.name.name === "heading") {
              heading = getValueFromJSXAttribute(attribute);
            }
            if (attribute.node.name.name === "purpose") {
              purpose = getValueFromJSXAttribute(attribute);
              if (!PURPOSES.includes(purpose)) {
                throw attribute.buildCodeFrameError(
                  `Purpose must be one of ${PURPOSES.join(", ")}`
                );
              }
            }
          } else {
            throw path.buildCodeFrameError(
              "You cannot spread props on a Note component"
            );
          }
        }
        if (purpose === undefined) {
          throw path.buildCodeFrameError(
            "purpose must be passed to the Note component"
          );
        }
        if (details === undefined) {
          throw path.buildCodeFrameError(
            "details must be passed to the Note component"
          );
        }
        addMarking({
          details,
          heading: heading || purpose,
          purpose,
          location: {
            line: path.node.loc!.start.line
          }
        });
      }
    }
  }
};
