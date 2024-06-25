import { createContext, useContext } from "react";

const serverErrorContext = createContext<RhfErrors>(undefined);
export const ServerErrorProvider = serverErrorContext.Provider;
export const useServerErrorContext = () => useContext(serverErrorContext);
