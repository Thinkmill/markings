import { createContext, useContext } from "react";

import { Purpose } from "@markings/types";

type IssueId = number | string;

export type MarkingType = {
  description: string;
  issue?: IssueId;
  purpose: Purpose;
};

export type ConfigType = {
  resolveIssueCreatePath: ({
    description,
    purpose,
  }: {
    description: string;
    purpose: Purpose;
  }) => string;
  resolveIssuePath: (id: IssueId) => string;
  resolvePrPath: (id: IssueId) => string;
};
export type ContextType = {
  enabled: boolean;
  register: (id: string, props: MarkingType) => string | undefined;
  unregister: (id: string) => void;
};

export const MarkingContext = createContext<ContextType | undefined>(undefined);

export const useMarkingRegistry = () => {
  const ctx = useContext(MarkingContext);
  if (!ctx) {
    throw Error("You must wrap the app with the MarkingProvider.");
  }
  return ctx;
};
