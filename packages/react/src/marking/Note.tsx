/** @jsx jsx */

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import { jsx } from "@emotion/core";
import hashString from "@emotion/hash";

import {
  MarkingContext,
  MarkingType,
  ConfigType,
  useMarkingRegistry,
  ContextType,
} from "./NoteContext";
import { MarkingPanel } from "./NotePanel";

type RecordOfMarkings = { [id: string]: MarkingType };

// Provider
// ------------------------------

type ProviderProps = {
  children: ReactNode;
  // config: ConfigType;
};

export const MarkingProvider = ({ children }: ProviderProps) => {
  const [notes, setNotes] = useState<RecordOfMarkings>({});

  const ctx: ContextType = useMemo(() => {
    return {
      register: (id, note) => {
        setNotes((currentNotes) => ({ ...currentNotes, [id]: note }));
        return id;
      },
      unregister: (id) => {
        setNotes(({ [id]: unusedValue, ...restNotes }) => restNotes);
      },
    };
  }, []);

  return (
    <MarkingContext.Provider value={ctx}>
      {children}
      {typeof window !== "undefined" && <MarkingPanel notes={notes} />}
    </MarkingContext.Provider>
  );
};

/**
 * Registers notes and wraps a unique attribute around the Note component
 */
export const Marking = ({
  children,
  ...props
}: MarkingType & { children: ReactNode }) => {
  const { register, unregister } = useMarkingRegistry();
  // TODO: notes should have a unique id and we should use that instead
  const id = useMemo(
    () => hashString(JSON.stringify(props)),
    Object.values(props)
  );

  useEffect(() => {
    register(id, props);
    return () => {
      unregister(id);
    };
  }, []);

  return (
    <div data-marking-id={id} style={{ display: "contents" }}>
      {children}
    </div>
  );
};
