/** @jsx jsx */

import {
  Fragment,
  HTMLAttributes,
  forwardRef,
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";

import {
  color,
  elevation,
  jsx,
  radii,
  spacing
} from "@untitled-design-system/core";
import { AddIcon } from "@untitled-design-system/icon/AddIcon";
import { CloseIcon } from "@untitled-design-system/icon/CloseIcon";
import { HelpIcon } from "@untitled-design-system/icon/HelpIcon";
import { usePopover } from "@untitled-design-system/popover";
import { Stack } from "@untitled-design-system/stack";

import { AnnotationType, useAnnotationRegistry } from "./AnnotationContext";

/**
 * Renders all of the UI to do with viewing the list of annotations.
 */
export const AnnotationPanel = () => {
  const blanketElement = useRef<HTMLElement>(null);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [notesAreVisible, setNotesVisible] = useLocalStorage(
    "notesAreVisible",
    false
  );
  const { annotations, config } = useAnnotationRegistry();
  const {
    isOpen,
    openPopover,
    closePopover,
    dialogRef,
    triggerRef
  } = usePopover("top-end");

  const itemMouseEnter = (id: string) => () => {
    setActiveAnnotation(id);

    const el = document.querySelector(`[data-react-annotation-id="${id}"]`);

    if (el) {
      blanketElement.current = el;

      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
  };
  const itemMouseLeve = () => {
    setActiveAnnotation(null);
    blanketElement.current = null;
  };

  // sync visible checkbox with triggers
  useEffect(() => {
    let els = document.querySelectorAll(`[data-react-annotation-trigger]`);

    if (els) {
      let style = notesAreVisible ? "visible" : "hidden";

      els.forEach(e => {
        e.style.visibility = style;
      });
    }
  }, [notesAreVisible]);

  if (typeof document === "undefined") {
    return null;
  }

  const annotationCount = Object.keys(annotations).length;

  // bail if there are no registered annotations
  if (!annotationCount) {
    return null;
  }

  const groupedItems = groupItems(annotations);

  return createPortal(
    <Fragment>
      {isOpen && (
        <Dialog ref={dialogRef}>
          <DialogHeader>
            <span css={{ color: color.N500, fontWeight: "bold" }}>
              {plural(annotationCount, "Dev Note", "Dev Notes")}
            </span>
            <label css={{ fontSize: 12, userSelect: "none" }}>
              Visible
              <input
                type="checkbox"
                checked={notesAreVisible}
                onChange={e => setNotesVisible(e.target.checked)}
                css={{ marginLeft: spacing.xsmall }}
              />
            </label>
          </DialogHeader>
          <ScrollPane>
            {Object.entries(groupedItems).map(([purpose, items]) => (
              <Group key={purpose}>
                <GroupTitle>{purpose}</GroupTitle>
                <Stack
                  as="ul"
                  dividers="between"
                  css={{ margin: 0, padding: 0 }}
                >
                  {items.map(item => (
                    <Item
                      isActive={activeAnnotation === item.id}
                      key={item.id}
                      onMouseEnter={itemMouseEnter(item.id)}
                      onMouseLeave={itemMouseLeve}
                    >
                      <div
                        css={{
                          flex: 1,
                          lineHeight: 1.6,
                          paddingRight: spacing.small
                        }}
                      >
                        {item.description}
                      </div>
                      <div
                        css={{
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "flex-end",
                          minHeight: "1.6em",
                          width: 48
                        }}
                      >
                        {item.issue ? (
                          <a
                            href={config.resolveIssuePath(item.issue)}
                            rel="noopener noreferrer"
                            target="_blank"
                            title="Go to related issue"
                            css={{
                              color: color.N400,
                              fontWeight: "bold",
                              textDecoration: "none",
                              // ':hover': { textDecoration: 'underline' },
                              ":hover": { color: color.P400 }
                            }}
                          >
                            #{item.issue}
                          </a>
                        ) : (
                          <a
                            href={config.resolveIssueCreatePath(item)}
                            rel="noopener noreferrer"
                            target="_blank"
                            title="Create an issue for this note"
                            css={{
                              color: color.N400,
                              ":hover": { color: color.P400 }
                            }}
                          >
                            <AddIcon size="small" />
                          </a>
                        )}
                      </div>
                    </Item>
                  ))}
                </Stack>
              </Group>
            ))}
          </ScrollPane>
          {/* <DialogFooter>
            Mouse over an item to highlight it. Click to scroll to that item.
          </DialogFooter> */}
        </Dialog>
      )}
      <Fab onClick={isOpen ? closePopover : openPopover} ref={triggerRef}>
        {isOpen ? <CloseIcon size="small" /> : <HelpIcon />}
        {/* {annotationCount} */}
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

/** The element that popups up to display all the annotations */
const Dialog = forwardRef<HTMLDivElement>((props, consumerRef) => {
  return (
    <div
      ref={consumerRef}
      css={{
        background: DIALOG_BG,
        borderRadius: radii.small,
        boxShadow: `0px 5px 40px rgba(0, 0, 0, 0.16)`,
        boxSizing: "border-box",
        maxHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        outline: 0,
        width: 375,
        zIndex: elevation.E500
      }}
      {...props}
    />
  );
});
const DialogHeader = (props: SCProps) => (
  <div
    css={{
      alignItems: "center",
      background: color.N100,
      border: 0,
      borderBottom: `1px solid ${color.N200}`,
      borderTopLeftRadius: radii.small,
      borderTopRightRadius: radii.small,
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "space-between",
      outline: 0,
      paddingBottom: GUTTER_LG,
      paddingLeft: GUTTER_LG,
      paddingRight: GUTTER_LG,
      paddingTop: GUTTER_LG,
      width: "100%"
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
      boxShadow: `0 -1px 0 ${color.N200A}`,
      borderBottomLeftRadius: radii.small,
      borderBottomRightRadius: radii.small,
      boxSizing: "border-box",
      color: "#777",
      display: "flex",
      fontSize: 12,
      justifyContent: "space-between",
      outline: 0,
      paddingBottom: GUTTER_SM,
      paddingLeft: GUTTER_LG,
      paddingRight: GUTTER_LG,
      paddingTop: GUTTER_SM,
      width: "100%"
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
const Group = (props: SCProps) => (
  <div
    css={{
      // boxShadow: `0 -1px 0 ${color.N200A}`,
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
      boxShadow: `0 1px 0 ${color.N200A}`,
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
type ItemProps = { isActive: boolean } & HTMLAttributes<HTMLLIElement>;
const Item = ({ isActive, ...props }: ItemProps) => (
  <li
    css={{
      alignItems: "flex-start",
      color: color.N500,
      cursor: "help",
      display: "flex",
      fontSize: 14,
      lineHeight: 1,
      margin: 0,
      // paddingLeft: GUTTER_LG,
      paddingRight: GUTTER_LG,
      paddingBottom: GUTTER_SM,
      paddingTop: GUTTER_SM
    }}
    {...props}
  />
);

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

  const gutter = 8;

  return createPortal(
    <div
      css={{
        background: "rgba(38, 132, 255, 0.25)",
        outline: `1px dashed #0052CC`,
        opacity: 0.5,
        marginLeft: -gutter,
        marginTop: -gutter,
        padding: gutter,
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
  [id: string]: AnnotationType;
};
type TGroupedItems = {
  [purpose: string]: AnnotationType[];
};

function groupItems(obj: TItems): TGroupedItems {
  // strip children + ensure `purpose` property
  let arr = Object.entries(obj).map(([id, { children, ...data }]) => {
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
  }, {});
}

/** Takes a key to store against and an initial value, returns the `useState` signature. */
function useLocalStorage<Value = any>(key: string, initialValue: Value) {
  const [storedValue, setStoredValue] = useState<Value>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Wrap useState, persist the value to localStorage
  const setValue = (value: Value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

function plural(n: number, s: string, p: string) {
  return `${n} ${n === 1 ? s : p}`;
}
