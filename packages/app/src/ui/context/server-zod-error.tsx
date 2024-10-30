import { createContext, useContext } from "react";
import { ZodIssue } from "zod";

const serverZodErrorContext = createContext<ZodIssue[]>([]);
export const ServerZodErrorProvider = serverZodErrorContext.Provider;
export const useServerZodError = () => useContext(serverZodErrorContext);
