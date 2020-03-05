/** @jsx jsx */

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { jsx } from "@emotion/core";

import {
  AnnotationContext,
  AnnotationType,
  ConfigType,
  useAnnotationRegistry
} from "./AnnotationContext";
import { AnnotationPanel } from "./AnnotationPanel";

type TAnnotations = { [id: string]: AnnotationType };

// Provider
// ------------------------------

type ProviderProps = {
  children: ReactNode;
  config: ConfigType;
};

export const AnnotationProvider = ({ children, config }: ProviderProps) => {
  const [annotations, setAnnotations] = useState<TAnnotations>({});

  const register = useCallback((props: {}) => {
    const id = generateUID(props);

    setAnnotations(past => ({ ...past, [id]: props }));
    return id;
  }, []);
  const unregister = useCallback((id: string) => {
    setAnnotations(({ [id]: value, ...past }) => past);
  }, []);

  const ctx = { config, annotations, register, unregister };

  return (
    <AnnotationContext.Provider value={ctx}>
      {children}
      <AnnotationPanel />
    </AnnotationContext.Provider>
  );
};

/**
 * Registers annotations and wraps a unique attribute around the target
 */
type NoteProps = { children: ReactNode } & AnnotationType;
export const Annotation = ({ children, ...props }: NoteProps) => {
  const { register, unregister } = useAnnotationRegistry();
  const annotationId = useRef<string>();

  useEffect(() => {
    annotationId.current = register(props);
    return () => {
      unregister(annotationId.current);
      annotationId.current = undefined;
    };
  }, [props, register, unregister]);

  return (
    <div
      data-react-annotation-id={annotationId.current}
      style={{ position: "relative" }}
    >
      {children}
    </div>
  );
};

// Utils
// ------------------------------

/** Takes an object, typically props, and returns a unique string. */
function uidFactory() {
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

const generateUID = uidFactory();
