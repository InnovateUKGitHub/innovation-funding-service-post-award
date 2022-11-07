import { createContext } from "react";
import { Copy } from "@copy/Copy";

// will be initialised when Provider is called
export const contentContext = createContext<Copy>(null as unknown as Copy);

/* eslint-disable @typescript-eslint/naming-convention */
export const ContentProvider = contentContext.Provider;
