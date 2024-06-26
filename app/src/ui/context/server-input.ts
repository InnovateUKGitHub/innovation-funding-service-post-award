import { createContext, useContext } from "react";

const serverInputContext = createContext<AnyObject | undefined>(undefined);
export const ServerInputContextProvider = serverInputContext.Provider;
export const useServerInputContext = () => useContext(serverInputContext);
