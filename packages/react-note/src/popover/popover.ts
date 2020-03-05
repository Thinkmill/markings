/** @jsx jsx */

import { useMemo, useState } from "react";

import { Modifier, Options, Placement, usePopper } from "./popper";
import { useClickOutside, useKeyPress } from "./utils";

type Modifiers = Modifier<Options>[];

// Hook
// ------------------------------

export const usePopover = (
  placement: Placement = "bottom",
  modifiers?: Modifiers
) => {
  const [isOpen, setOpen] = useState(false);
  const openPopover = () => setOpen(true);
  const closePopover = () => setOpen(false);

  // prepare popper instance
  const config = useMemo(() => mergePopperConfig(placement, modifiers), [
    placement,
    modifiers
  ]);
  const [triggerRef, dialogRef] = usePopper(isOpen, config);

  // close on click outside
  useClickOutside({
    handler: closePopover,
    refs: [triggerRef, dialogRef],
    listenWhen: isOpen
  });

  // close on esc press
  useKeyPress({
    targetKey: "Escape",
    downHandler: closePopover,
    listenWhen: isOpen
  });

  return { isOpen, openPopover, closePopover, dialogRef, triggerRef };
};

// Utils
// ------------------------------

const mergePopperConfig = (
  placement: Placement,
  modifiers: Modifiers = []
) => ({
  placement: placement,
  modifiers: [
    {
      name: "offset",
      options: {
        offset: [0, 8]
      }
    },
    ...modifiers
  ]
});
