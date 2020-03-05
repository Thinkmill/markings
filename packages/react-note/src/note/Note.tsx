/** @jsx jsx */

import { Fragment, ReactNode, forwardRef } from "react";

import { AddIcon } from "@untitled-design-system/icon/AddIcon";
import { ClockIcon } from "@untitled-design-system/icon/ClockIcon";
import { color, elevation, jsx, spacing } from "@untitled-design-system/core";
import { HelpTipIcon } from "@untitled-design-system/icon/HelpTipIcon";
import { HorizontalRule } from "@untitled-design-system/typography";
import { Text } from "@untitled-design-system/typography";
import { usePopover } from "@untitled-design-system/popover";
import { WarningIcon } from "@untitled-design-system/icon/WarningIcon";

const purposeMap = {
  rethink: { Icon: WarningIcon, fill: "bad", heading: "Rethink" },
  question: { Icon: HelpTipIcon, fill: "O400", heading: "Question" },
  addition: { Icon: AddIcon, fill: "M400", heading: "Addition" },
  todo: { Icon: ClockIcon, fill: "P400", heading: "TODO" }
};

export type NoteProps = {
  children: ReactNode;
  description: string;
  heading?: string;
  issue?: string;
  pr?: string;
  purpose?: keyof typeof purposeMap;
};

export const Note = ({
  children,
  description,
  heading,
  purpose = "todo"
}: NoteProps) => {
  const {
    isOpen,
    openPopover,
    closePopover,
    dialogRef,
    triggerRef
  } = usePopover("right-start");

  const { Icon, fill, heading: defaultHeading } = purposeMap[purpose];

  return (
    <Fragment>
      <div
        ref={triggerRef}
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        data-react-annotation-trigger
        css={{
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "50%",
          boxShadow: `0 0 0 2px ${color.N200A}`,
          cursor: "help",
          display: "flex",
          height: 32,
          justifyContent: "center",
          // left: -8,
          position: "absolute",
          top: 0,
          transform: "translateX(-100%) scale(0.75)",
          transition: "transform 150ms",
          width: 32,

          ":hover": {
            transform: "translateX(-100%) scale(1)"
          }
        }}
      >
        <Icon fill={fill} />
      </div>
      {isOpen && (
        <Dialog
          ref={dialogRef}
          style={{ borderLeft: `4px solid ${color[fill]}` }}
        >
          <Text weight="bold" color={fill} as="h4" mb="xsmall">
            {heading || defaultHeading}
          </Text>
          {description}
        </Dialog>
      )}
      {children || <HorizontalRule />}
    </Fragment>
  );
};

// Dialog
// ------------------------------

type DialogProps = {
  /** The content of the dialog. */
  children: ReactNode;
};

export const Dialog = forwardRef<HTMLElement, DialogProps>(
  (props, consumerRef) => {
    return (
      <div
        ref={consumerRef}
        css={{
          background: color.N0,
          boxShadow: `
          0 0 2px rgba(0, 0, 0, 0.1),
          0 3px 12px -1px rgba(0, 0, 0, 0.1)
        `,
          boxSizing: "border-box",
          outline: "none",
          width: 280,
          padding: `${spacing.small}px ${spacing.medium}px`,
          zIndex: elevation.E100
        }}
        {...props}
      />
    );
  }
);
