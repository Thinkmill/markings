/** @jsx jsx */

import {
  AllHTMLAttributes,
  Fragment,
  HTMLAttributes,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { jsx } from "@emotion/core";

import { color, elevation, radii, spacing } from "../tokens";
import { CrossIcon, PinIcon } from "../icons";
import { usePopover } from "../popover";

import { NoteType, useNoteRegistry, ConfigType } from "./NoteContext";
import { Purpose } from "@markings/types";

/**
 * Renders all of the UI to do with viewing the list of notes.
 */
export const NotePanel = ({
  config,
  notes
}: {
  config: ConfigType;
  notes: TItems;
}) => {
  const blanketElement = useRef<HTMLElement>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const {
    isOpen,
    openPopover,
    closePopover,
    dialogRef,
    triggerRef
  } = usePopover("top-end");

  const itemMouseEnter = (id: string) => () => {
    setActiveNote(id);

    const el = document.querySelector(`[data-react-note-id="${id}"]`);

    if (el) {
      // @ts-ignore
      blanketElement.current = el;

      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
  };
  const itemMouseLeve = () => {
    setActiveNote(null);
    // @ts-ignore
    blanketElement.current = null;
  };

  if (typeof document === "undefined") {
    return null;
  }

  const noteCount = Object.keys(notes).length;

  // bail if there are no registered notes
  if (!noteCount) {
    return null;
  }

  const groupedItems = groupItems(notes);

  return createPortal(
    <Fragment>
      {isOpen && (
        <Dialog
          // @ts-ignore
          ref={dialogRef}
        >
          <DialogHeader>
            <span css={{ fontWeight: "bold" }}>
              {plural(noteCount, "Note", "Notes")}
            </span>
            <p>
              <a
                href="https://github.com/Thinkmill/markings"
                title="Learn about Markings"
              >
                What is this?
              </a>
            </p>
          </DialogHeader>
          <ScrollPane>
            {Object.entries(groupedItems).map(([purpose, items]) => (
              <Group key={purpose}>
                <GroupTitle>{purpose}</GroupTitle>
                <ul css={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {items.map(item => {
                    const href = item.issue
                      ? config.resolveIssuePath(item.issue)
                      : config.resolveIssueCreatePath(item);
                    const anchorTitle = item.issue
                      ? "Go to related issue"
                      : "Create an issue for this note";

                    return (
                      <Item
                        key={item.id}
                        onMouseEnter={itemMouseEnter(item.id)}
                        onMouseLeave={itemMouseLeve}
                      >
                        <ItemAnchor
                          href={href}
                          rel="noopener noreferrer"
                          target="_blank"
                          title={anchorTitle}
                        >
                          <ItemBody>
                            <p>{item.description}</p>
                          </ItemBody>
                          <ItemSymbol>
                            {item.issue && `#${item.issue}`}
                          </ItemSymbol>
                        </ItemAnchor>
                      </Item>
                    );
                  })}
                </ul>
              </Group>
            ))}
          </ScrollPane>
          {/* <DialogFooter>
            <p>
              What is this? Learn about{" "}
              <a href="https://github.com/Thinkmill/markings">markings</a>.
            </p>
          </DialogFooter> */}
        </Dialog>
      )}
      <Fab
        onClick={isOpen ? closePopover : openPopover}
        // @ts-ignore
        ref={triggerRef}
      >
        {isOpen ? <CrossIcon /> : <PinIcon size={24} />}
        {/* {noteCount} */}
      </Fab>
      {blanketElement.current && <Blanket element={blanketElement.current} />}
    </Fragment>,
    document.body
  );
};

// Styled Components
// ------------------------------

type SCProps = HTMLAttributes<HTMLDivElement>;

/** The button the user clicks to toggle the view panel. */
const Fab = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <button
      ref={ref}
      css={{
        alignItems: "center",
        backgroundColor: color.P400,
        border: 0,
        borderRadius: "50%",
        bottom: 20,
        color: "white",
        cursor: "pointer",
        display: "flex",
        fontWeight: "bold",
        fontSize: 24,
        height: 44,
        justifyContent: "center",
        outline: 0,
        position: "fixed",
        right: 20,
        transition: "all 150ms",
        width: 44,
        zIndex: elevation.E400,

        ":hover": {
          boxShadow: `0 0 0 2px ${color.P400}`
        }
      }}
      type="button"
      {...props}
    />
  );
});

const DIALOG_BG = "white";
const GUTTER_LG = spacing.medium;
const GUTTER_SM = spacing.small;

/** The element that popups up to display all the notes */
const Dialog = forwardRef<HTMLDivElement>((props, consumerRef) => {
  return (
    <div
      ref={consumerRef}
      // @ts-ignore
      css={{
        background: DIALOG_BG,
        borderRadius: radii.medium,
        boxShadow: `rgba(101, 119, 134, 0.2) 0px 2px 15px, rgba(101, 119, 134, 0.12) 0px 1px 3px 1px`,
        boxSizing: "border-box",
        maxHeight: "calc(100vh - 120px)",
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
        margin: 0,
        fontFeatureSettings: "liga",
        textRendering: "optimizelegibility",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale"
      }}
      {...props}
    />
  );
});
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
const DialogFooter = (props: SCProps) => (
  <div
    css={{
      alignItems: "center",
      background: DIALOG_BG,
      border: 0,
      boxShadow: `0 -1px 0 ${color.N30}`,
      borderBottomLeftRadius: radii.small,
      borderBottomRightRadius: radii.small,
      boxSizing: "border-box",
      color: color.N400,
      display: "flex",
      fontSize: 12,
      justifyContent: "flex-end",
      outline: 0,
      padding: GUTTER_LG,
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
const ScrollPane = (props: SCProps) => (
  <div
    css={{
      flex: 1,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch"
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
const ItemAnchor = (props: AllHTMLAttributes<HTMLAnchorElement>) => (
  <a
    css={{
      alignItems: "flex-start",
      color: color.N600,
      cursor: "pointer",
      display: "flex",
      fontSize: 14,
      // paddingLeft: GUTTER_LG,
      paddingRight: GUTTER_LG,
      paddingBottom: GUTTER_SM,
      paddingTop: GUTTER_SM,
      textDecoration: "none"
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
const ItemSymbol = (props: SCProps) => (
  <div
    css={{
      alignItems: "center",
      color: color.N100,
      display: "flex",
      fontWeight: "bold",
      justifyContent: "flex-end",
      minHeight: "1.6em",
      minWidth: 48,

      "a:hover &": { color: color.P400 }
    }}
    {...props}
  />
);

// issue labels
const ItemMeta = ({ meta }: { meta: any }) => {
  if (!(meta.labels && meta.labels.length) || !meta.assignee) {
    return null;
  }

  return (
    <div css={{ display: "flex", flexWrap: "wrap" }}>
      <ItemAssignee assignee={meta.assignee} />
      {meta.labels && meta.labels.length ? (
        meta.labels.map((l: any) => (
          <ItemLabel bg={l.color} key={l.name}>
            {l.name}
          </ItemLabel>
        ))
      ) : (
        <strong css={{ fontSize: 12 }}>{meta.assignee.login}</strong>
      )}
    </div>
  );
};
type ItemLabelProps = { bg: string } & SCProps;
const ItemLabel = ({ bg, ...props }: ItemLabelProps) => {
  const fg = useMemo(() => foreground(bg), [bg]);
  return (
    <div
      css={{
        borderRadius: 2,
        color: fg,
        display: "inline-block",
        fontSize: 11,
        fontWeight: "bold",
        height: 16,
        lineHeight: "15px",
        marginTop: 4,
        marginRight: 4,
        paddingLeft: 4,
        paddingRight: 4
      }}
      style={{ backgroundColor: `#${bg}` }}
      {...props}
    />
  );
};

// assignee
type ItemAssigneeProps = {
  assignee: { avatar_url: string; login: string };
} & SCProps;
const ItemAssignee = ({ assignee }: ItemAssigneeProps) => {
  if (!assignee) {
    return null;
  }

  return (
    <img
      css={{
        borderRadius: 2,
        display: "inline-block",
        height: 16,
        marginRight: 4,
        marginTop: 4,
        width: 16
      }}
      src={assignee.avatar_url}
      alt={`Avatar for ${assignee.login}`}
      title={assignee.login}
    />
  );
};

/** Overlays the matching element to highlight the region to the user */
type BlanketProps = {
  element: HTMLElement;
};
const Blanket = ({ element }: BlanketProps) => {
  if (typeof document === "undefined") {
    return null;
  }

  const rect = element.getBoundingClientRect();
  // const style = window.getComputedStyle(element);
  // const rounding = {
  //   borderBottomLeftRadius: style['border-bottom-left-radius'],
  //   borderBottomRightRadius: style['border-bottom-right-radius'],
  //   borderTopLeftRadius: style['border-top-left-radius'],
  //   borderTopRightRadius: style['border-top-right-radius'],
  // };

  // const gutter = 1;

  return createPortal(
    <div
      css={{
        background: "rgba(38, 132, 255, 0.25)",
        outline: `1px dashed #0052CC`,
        opacity: 0.5,
        // marginLeft: -gutter,
        // marginTop: -gutter,
        // padding: gutter,
        position: "absolute",
        pointerEvents: "none",
        zIndex: elevation.E400
      }}
      style={{
        // ...rounding,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        height: rect.height,
        width: rect.width
      }}
    />,
    document.body
  );
};

// Utils
// ------------------------------

type TItems = {
  [id: string]: NoteType;
};

type TGroupedItems = {
  [Key in Purpose]: (NoteType & { id: string })[];
};

function groupItems(obj: TItems): TGroupedItems {
  // strip children + ensure `purpose` property
  let arr = Object.entries(obj).map(([id, data]) => {
    if (!data.purpose) {
      return { id, purpose: "todo", ...data };
    }
    return { id, ...data };
  });

  // create an object grouped by the purpose property
  return arr.reduce((acc, note) => {
    acc[note.purpose] = acc[note.purpose] || [];
    acc[note.purpose].push(note);

    return acc;
  }, {} as TGroupedItems);
}

function plural(n: number, s: string, p: string) {
  return `${n} ${n === 1 ? s : p}`;
}

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
