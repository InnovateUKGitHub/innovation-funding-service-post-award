import { createContext } from "react";
import { Copy } from "@copy/Copy";

export const contentContext = createContext<Copy>(null as any);

/* eslint-disable @typescript-eslint/naming-convention */
export const ContentProvider = contentContext.Provider;
