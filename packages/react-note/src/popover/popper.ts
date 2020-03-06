import { useLayoutEffect, useRef } from "react";
import {
  Instance,
  Modifier as _Modifier,
  Options as _Options,
  Placement as _Placement,
  createPopper
} from "@popperjs/core";

export type Modifier<Options> = _Modifier<Options>;
export type Options = _Options;
export type Placement = _Placement;

export const usePopper = (isActive = false, options: Partial<Options>) => {
  const referenceRef = useRef<HTMLElement>(null); // target, like <button />
  const popperRef = useRef<HTMLElement>(null); // dialog, tooltip or similar
  const instanceRef = useRef<Instance | null>(null); // the popper instance

  useLayoutEffect(() => {
    if (isActive && referenceRef.current && popperRef.current) {
      const popper = createPopper(
        referenceRef.current,
        popperRef.current,
        options
      );

      instanceRef.current = popper;

      return () => {
        popper.destroy();
        instanceRef.current = null;
      };
    }

    // NOTE: only called when the value of `isActive` changes.
    // The effect below will catch changes to the `options` object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // update options when they change. object as compared by reference
  // so consumers must be careful about what they pass through.
  useLayoutEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.setOptions(options);
      instanceRef.current.update();
    }
  }, [options]);

  return [referenceRef, popperRef];
};
