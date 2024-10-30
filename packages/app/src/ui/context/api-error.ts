import { ClientErrorResponse } from "@framework/util/errorHandlers";
import { createContext, useContext } from "react";

const apiErrorContext = createContext<ClientErrorResponse | null>(null);
export const ApiErrorContextProvider = apiErrorContext.Provider;
export const useApiErrorContext = () => useContext(apiErrorContext);
