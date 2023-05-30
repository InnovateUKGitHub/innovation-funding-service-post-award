import { IAppError } from "@framework/types";
import { createContext, useContext } from "react";

const apiErrorContext = createContext<IAppError | null | undefined>(null);
export const ApiErrorContextProvider = apiErrorContext.Provider;
export const useApiErrorContext = () => useContext(apiErrorContext);
