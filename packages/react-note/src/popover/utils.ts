import {
  RefObject,
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useRef
} from "react";

// Click Outside
// ------------------------------

// NOTE: mouse event handler defined here rather than imported from react becase
// the event listener will return a native event, not a synthetic event
type MouseHandler = (event: MouseEvent) => void;
type UseClickOutsideProps = {
  handler: MouseHandler;
  refs: RefObject<HTMLElement>[];
  listenWhen: boolean;
};

export const useClickOutside = ({
  handler,
  refs,
  listenWhen
}: UseClickOutsideProps): RefObject<HTMLElement> => {
  const ref = useRef<HTMLElement>(null);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      // bail on mouse down "inside" any of the provided refs
      if (
        refs.some(
          ref => ref.current && ref.current.contains(event.target as Node)
        )
      ) {
        return;
      }

      handler(event);
    },
    [handler, refs]
  );

  // layout effect is not run on the server
  useLayoutEffect(() => {
    if (listenWhen) {
      document.addEventListener("mousedown", handleMouseDown);

      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
      };
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [listenWhen, handleMouseDown]);

  return ref;
};

// Key Press
// ------------------------------

// NOTE: keyboard event handler defined here rather than imported from react becase
// the event listener will return a native event, not a synthetic event
type KeyboardHandler = (event: KeyboardEvent) => void;
type UseKeyPressProps = {
  targetKey: string;
  downHandler?: KeyboardHandler;
  upHandler?: KeyboardHandler;
  listenWhen: boolean;
};

export const useKeyPress = ({
  targetKey,
  downHandler,
  upHandler,
  listenWhen
}: UseKeyPressProps) => {
  // Keep track of whether the target key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // handle key down
  const onDown = useCallback(
    (event: KeyboardEvent) => {
      if (!targetKey || event.key === targetKey) {
        setKeyPressed(true);

        if (typeof downHandler === "function") {
          downHandler(event);
        }
      }
    },
    [targetKey, downHandler]
  );

  // handle key up
  const onUp = useCallback(
    (event: KeyboardEvent) => {
      if (!targetKey || event.key === targetKey) {
        setKeyPressed(false);

        if (typeof upHandler === "function") {
          upHandler(event);
        }
      }
    },
    [targetKey, upHandler]
  );

  // add event listeners
  useEffect(() => {
    if (listenWhen) {
      window.addEventListener("keydown", onDown);
      window.addEventListener("keyup", onUp);

      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener("keydown", onDown);
        window.removeEventListener("keyup", onUp);
      };
    }
  }, [listenWhen, onDown, onUp]);

  return keyPressed;
};
