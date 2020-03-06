import { createContext, useContext } from "react";

import { PurposeType } from "./types";

export type NoteType = {
  description: string;
  id: string;
  issue?: number | string;
  purpose: PurposeType;
};
export type ConfigType = {
  resolveIssueCreatePath: ({
    description,
    purpose
  }: {
    description: string;
    purpose: PurposeType;
  }) => string;
  resolveIssuePath: (id: string) => string;
  resolvePrPath: (id: string) => string;
};
export type ContextType = {
  notes: { [id: string]: NoteType };
  config: ConfigType;
  register: (props: NoteType) => string;
  unregister: (id: string) => void;
};

export const NoteContext = createContext<ContextType>({
  notes: {},
  config: {
    resolveIssueCreatePath: () => "",
    resolveIssuePath: id => "",
    resolvePrPath: id => ""
  },
  register: props => "",
  unregister: id => null
});

export const useNoteRegistry = () => {
  const ctx = useContext(NoteContext);
  if (!ctx) {
    throw Error("You must wrap the app with the NoteProvider.");
  }
  return ctx;
};
