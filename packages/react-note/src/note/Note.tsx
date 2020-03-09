/** @jsx jsx */

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { jsx } from "@emotion/core";

import {
  NoteContext,
  NoteProps,
  NoteType,
  ConfigType,
  useNoteRegistry
} from "./NoteContext";
import { NotePanel } from "./NotePanel";
import { data as githubIssueData } from "./temp-data";

type TNotes = { [id: string]: NoteType };

// Provider
// ------------------------------

type ProviderProps = {
  children: ReactNode;
  config: ConfigType;
};

export const NoteProvider = ({ children, config }: ProviderProps) => {
  const [notes, setNotes] = useState<TNotes>({});

  const register = useCallback((props: NoteType) => {
    const id = generateUID(props);

    if (id in notes) {
      return;
    }

    // TODO: not sure how this would actually work, right now i'm just pulling stub data...
    const meta = props.issue ? githubIssueData : {};
    // let meta = {};
    // if (props.issue) {
    //   meta = await fetch(
    //     `https://api.github.com/repos/thinkmill/markings/issues/${props.issue}`
    //   ).then(r => r.json());
    // }

    const note = { ...props, meta };

    setNotes(currentNotes => ({ ...currentNotes, [id]: note }));
    return id;
  }, []);
  const unregister = useCallback((id: string) => {
    setNotes(({ [id]: unusedValue, ...restNotes }) => restNotes);
  }, []);

  const ctx = { config, notes, register, unregister };

  return (
    <NoteContext.Provider value={ctx}>
      {children}
      <NotePanel />
    </NoteContext.Provider>
  );
};

/**
 * Registers notes and wraps a unique attribute around the Note component
 */
export const Note = ({
  children,
  ...props
}: NoteProps & { children: ReactNode }) => {
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
