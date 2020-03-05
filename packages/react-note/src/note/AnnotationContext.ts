import { createContext, useContext } from 'react';

import { PurposeType } from './types';

export type AnnotationType = {
  description: string;
  id: string;
  issue?: string;
  purpose: PurposeType;
};
export type ConfigType = {
  resolveIssueCreatePath: ({
    description,
    purpose,
  }: {
    description: string;
    purpose: PurposeType;
  }) => string;
  resolveIssuePath: (id: string) => string;
  resolvePrPath: (id: string) => string;
};
export type ContextType = {
  annotations: { [id: string]: AnnotationType };
  config: ConfigType;
  register: (props: AnnotationType) => string;
  unregister: (id: string) => void;
};

export const AnnotationContext = createContext<ContextType>({
  annotations: {},
  config: {
    resolveIssueCreatePath: () => '',
    resolveIssuePath: id => '',
    resolvePrPath: id => '',
  },
  register: props => '',
  unregister: id => null,
});

export const useAnnotationRegistry = () => {
  const ctx = useContext(AnnotationContext);
  if (!ctx) {
    throw Error('You must wrap the app with the AnnotationProvider.');
  }
  return ctx;
};
