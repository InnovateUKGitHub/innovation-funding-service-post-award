import { useContext, createContext } from "react";
import { BaseProps } from "./containerBase";

export const AppContext = createContext<BaseProps>({} as BaseProps);

export const useAppContext = () => useContext(AppContext);
