import { ReactNode, createContext, useContext } from "react";

import { Purpose } from "@markings/types";

type IssueId = number | string;

export type NoteType = {
  description: string;
  issue?: IssueId;
  purpose: Purpose;
};

export type ConfigType = {
  resolveIssueCreatePath: ({
    description,
    purpose
  }: {
    description: string;
    purpose: Purpose;
  }) => string;
  resolveIssuePath: (id: IssueId) => string;
  resolvePrPath: (id: IssueId) => string;
};
export type ContextType = {
  register: (props: NoteType) => string | undefined;
  unregister: (id: string) => void;
};

export const NoteContext = createContext<ContextType | undefined>(undefined);

export const useNoteRegistry = () => {
  const ctx = useContext(NoteContext);
  if (!ctx) {
    throw Error("You must wrap the app with the NoteProvider.");
  }
  return ctx;
};
