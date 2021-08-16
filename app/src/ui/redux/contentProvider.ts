import { createContext } from "react";
import { Content } from "@content/content";

export const contentContext = createContext<Content>(null as any);

/* eslint-disable @typescript-eslint/naming-convention */
export const ContentProvider = contentContext.Provider;
