import { Result } from "@ui/validation/result";
import { createContext, useContext } from "react";

const formErrorContext = createContext<Result[] | undefined>(undefined);
export const FormErrorContextProvider = formErrorContext.Provider;
export const useFormErrorContext = () => useContext(formErrorContext);
