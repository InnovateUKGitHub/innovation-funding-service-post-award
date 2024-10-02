import { ClientErrorResponse } from "@framework/util/errorHandlers";
import { createContext, useContext } from "react";

const serverErrorContext = createContext<ClientErrorResponse | null>(null);
export const ServerErrorContextProvider = serverErrorContext.Provider;
export const useServerErrorContext = () => useContext(serverErrorContext);
