/** @jsx jsx */

import { AllHTMLAttributes, Fragment, HTMLAttributes, useRef } from "react";
import { jsx } from "@emotion/core";

import { color, radii, spacing, elevation } from "./tokens";

import { Purpose, Marking } from "@markings/types";

/**
 * Renders all of the UI to do with viewing the list of notes.
 */
export const NotePanel = ({ markings }: { markings: Marking[] }) => {
  // bail if there are no registered notes
  if (!markings.length) {
    return <span>No notes found</span>;
  }

  const groupedItems = groupItems(markings);

  return (
    <div
      css={{
        display: "flex",
        padding: 8,
        justifyContent: "center",
        flexWrap: "wrap"
      }}
    >
      {Object.entries(groupedItems).map(([pkgName, group]) => {
        let entries = Object.entries(group);
        return (
          <Dialog key={pkgName}>
            <DialogHeader>
              <span css={{ fontWeight: "bold" }}>
                {plural(
                  entries.reduce(
                    (accum, [_purpose, val]) => accum + val.length,
                    0
                  ),
                  "Note",
                  "Notes"
                )}{" "}
                in {pkgName}
              </span>
            </DialogHeader>
            {entries.map(([purpose, items]) => (
              <Group key={purpose}>
                <GroupTitle>{purpose}</GroupTitle>
                <ul css={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {items.map((item, index) => {
                    let Comp: any = item.location.link ? "a" : "span";
                    return (
                      <Item key={index}>
                        <Comp
                          href={item.location.link}
                          css={{
                            alignItems: "flex-start",
                            color: color.N600,
                            display: "flex",
                            fontSize: 14,
                            // paddingLeft: GUTTER_LG,
                            paddingRight: GUTTER_LG,
                            paddingBottom: GUTTER_SM,
                            paddingTop: GUTTER_SM,
                            textDecoration: "none"
                          }}
                        >
                          <ItemBody>
                            <p>{item.description}</p>
                          </ItemBody>
                        </Comp>
                      </Item>
                    );
                  })}
                </ul>
              </Group>
            ))}
          </Dialog>
        );
      })}
    </div>
  );
};

// Styled Components
// ------------------------------

type SCProps = HTMLAttributes<HTMLDivElement>;

const DIALOG_BG = "white";
const GUTTER_LG = spacing.medium;
const GUTTER_SM = spacing.small;

const DialogHeader = (props: SCProps) => (
  <div
    css={{
      alignItems: "center",
      background: color.N20,
      border: 0,
      borderBottom: `1px solid ${color.N30}`,
      borderTopLeftRadius: radii.small,
      borderTopRightRadius: radii.small,
      boxSizing: "border-box",
      // color: color.N800,
      display: "flex",
      justifyContent: "space-between",
      outline: 0,
      paddingBottom: GUTTER_LG,
      paddingLeft: GUTTER_LG,
      paddingRight: GUTTER_LG,
      paddingTop: GUTTER_LG,
      width: "100%",

      p: {
        color: color.N400,
        fontSize: 12,
        margin: 0
      },
      a: {
        color: color.N600,
        textDecoration: "none",
        ":hover": {
          textDecoration: "underline"
        }
      }
    }}
    {...props}
  />
);

// groups
const Group = (props: SCProps) => (
  <div
    css={{
      // boxShadow: `0 -1px 0 ${color.N30}`,
      paddingLeft: GUTTER_LG,
      // paddingRight: GUTTER_LG,
      paddingBottom: GUTTER_LG
      // paddingTop: GUTTER_SM,
    }}
    {...props}
  />
);
const GroupTitle = (props: SCProps) => (
  <div
    css={{
      backgroundColor: DIALOG_BG,
      boxShadow: `0 1px 0 ${color.N30}`,
      color: color.P400,
      fontSize: 12,
      fontWeight: "bold",
      lineHeight: 1,
      // paddingLeft: GUTTER_LG,
      paddingRight: GUTTER_LG,
      paddingBottom: GUTTER_SM,
      paddingTop: GUTTER_LG,
      position: "sticky",
      textTransform: "uppercase",
      top: 0
    }}
    {...props}
  />
);

// items
const Item = (props: HTMLAttributes<HTMLLIElement>) => (
  <li
    css={{
      lineHeight: 1,
      margin: 0,
      padding: 0,

      ":not(:nth-of-type(1))": {
        borderTop: `1px dotted ${color.N40}`
      }
    }}
    {...props}
  />
);

const ItemBody = (props: SCProps) => (
  <div
    css={{
      flex: 1,
      lineHeight: 1.6,
      // paddingRight: spacing.small,

      p: {
        margin: 0
      }
    }}
    {...props}
  />
);

// Utils
// ------------------------------

type TGroupedItems = {
  [pkgName: string]: {
    [Key in Purpose]: Marking[];
  };
};

function groupItemsByPurpose(items: Marking[]) {
  // create an object grouped by the purpose property
  return items.reduce((acc, note) => {
    acc[note.purpose] = acc[note.purpose] || [];
    acc[note.purpose].push(note);

    return acc;
  }, {} as { [Key in Purpose]: Marking[] });
}

function groupItems(items: Marking[]): TGroupedItems {
  // create an object grouped by the purpose property
  let itemsByPackage = items.reduce(
    (acc, note) => {
      acc[note.package] = acc[note.package] || [];
      acc[note.package].push(note);

      return acc;
    },
    {} as {
      [pkgName: string]: Marking[];
    }
  );
  for (let pkgName in itemsByPackage) {
    (itemsByPackage as any)[pkgName] = groupItemsByPurpose(
      itemsByPackage[pkgName]
    );
  }
  return (itemsByPackage as any) as TGroupedItems;
}

function plural(n: number, s: string, p: string) {
  return `${n} ${n === 1 ? s : p}`;
}

const Dialog = (props: HTMLAttributes<HTMLDivElement>) => (
  <div
    // @ts-ignore
    css={{
      background: DIALOG_BG,
      borderRadius: radii.medium,
      boxShadow: `rgba(101, 119, 134, 0.2) 0px 2px 15px, rgba(101, 119, 134, 0.12) 0px 1px 3px 1px`,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      fontSize: 14,
      outline: 0,
      width: 375,
      zIndex: elevation.E500,

      // we can't assume anything about the render environment
      color: color.N600,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      margin: 16,
      fontFeatureSettings: "liga",
      textRendering: "optimizelegibility",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale"
    }}
    {...props}
  />
);

// color stuff
type RGB = [number, number, number];
function hexToRgb(hexString: string): RGB {
  let hex = hexString.replace("#", "");
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return [r, g, b];
}
function luminanace(rgb: RGB) {
  var a = rgb.map(function(v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
const foreground = (s: string) =>
  luminanace(hexToRgb(s)) > 0.6 ? "black" : "white";
