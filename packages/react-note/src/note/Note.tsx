/** @jsx jsx */

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";

import { jsx } from "@emotion/core";

import {
  NoteContext,
  NoteType,
  ConfigType,
  useNoteRegistry,
  ContextType
} from "./NoteContext";
import { NotePanel } from "./NotePanel";

type TNotes = { [id: string]: NoteType };

// Provider
// ------------------------------

type ProviderProps = {
  children: ReactNode;
  config: ConfigType;
};

export const NoteProvider = ({ children, config }: ProviderProps) => {
  const [notes, setNotes] = useState<TNotes>({});

  const ctx: ContextType = useMemo(() => {
    return {
      register: note => {
        const id = generateUID(note);

        if (id in notes) {
          return;
        }

        setNotes(currentNotes => ({ ...currentNotes, [id]: note }));
        return id;
      },
      unregister: id => {
        setNotes(({ [id]: unusedValue, ...restNotes }) => restNotes);
      }
    };
  }, []);

  return (
    <NoteContext.Provider value={ctx}>
      {children}
      <NotePanel config={config} notes={notes} />
    </NoteContext.Provider>
  );
};

/**
 * Registers notes and wraps a unique attribute around the Note component
 */
export const Note = ({
  children,
  ...props
}: NoteType & { children: ReactNode }) => {
  const { register, unregister } = useNoteRegistry();
  const noteId = useRef<string>();

  useEffect(() => {
    const id = register(props);
    if (id) {
      noteId.current = id;
      return () => {
        unregister(id);
        noteId.current = undefined;
      };
    }
  }, []);

  return (
    <div data-react-note-id={noteId.current} style={{ position: "relative" }}>
      {children}
    </div>
  );
};

// Utils
// ------------------------------

/** Takes an object, typically props, and returns a unique string. */
function uidClosure() {
  let counter = 1;

  const map = new WeakMap<any, number>();

  const uid = (item: any, index?: number): string => {
    if (typeof item === "number" || typeof item === "string") {
      return index ? `idx-${index}` : `val-${item}`;
    }

    if (!map.has(item)) {
      map.set(item, counter++);
      return uid(item);
    }
    return "uid" + map.get(item);
  };

  return uid;
}

const generateUID = uidClosure();
