import { BaseProps } from "@ui/app/containerBase";
import { createContext, useContext } from "react";

export const BasePropsContext = createContext<BaseProps>({} as BaseProps);

export const useBaseProps = () => useContext(BasePropsContext);
