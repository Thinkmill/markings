/** @jsx jsx */

import { ReactNode, useEffect, useState, ReactElement, useMemo } from "react";

import { jsx } from "@emotion/core";
import hashString from "@emotion/hash";

import {
  MarkingContext,
  MarkingType,
  useMarkingRegistry,
  ContextType,
} from "./NoteContext";
import { MarkingPanel } from "./NotePanel";

type RecordOfMarkings = { [id: string]: MarkingType };

// Provider
// ------------------------------

type ProviderProps = {
  children: ReactNode;
  enabled?: boolean;
  // config: ConfigType;
};

export const MarkingProvider = ({
  children,
  enabled = true,
}: ProviderProps) => {
  const [notes, setNotes] = useState<RecordOfMarkings>({});

  const ctx: ContextType = useMemo(() => {
    return {
      enabled,
      register: (id, note) => {
        setNotes((currentNotes) => ({ ...currentNotes, [id]: note }));
        return id;
      },
      unregister: (id) => {
        setNotes(({ [id]: unusedValue, ...restNotes }) => restNotes);
      },
    };
  }, [enabled]);

  return (
    <MarkingContext.Provider value={ctx}>
      {children}
      {typeof window !== "undefined" && enabled && (
        <MarkingPanel notes={notes} />
      )}
    </MarkingContext.Provider>
  );
};

/**
 * Registers notes and wraps a unique attribute around the Note component
 */
export const Marking = ({
  children,
  ...props
}: MarkingType & { children: ReactNode }): ReactElement => {
  const { register, unregister, enabled } = useMarkingRegistry();
  if (!enabled) {
    return children as any;
  }
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
