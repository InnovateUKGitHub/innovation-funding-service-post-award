import { ErrorCode } from "@framework/constants/enums";
import { IAppDetailedError } from "@framework/types/IAppError";
import { createContext, useContext } from "react";

export type ServerError = {
  errorCode: ErrorCode;
  errorType: string;
  errorMessage?: string | undefined;
  errorStack?: string | undefined;
  errorDetails?: IAppDetailedError[] | undefined;
} | null;

const serverErrorContext = createContext<ServerError>(null);
export const ServerErrorContextProvider = serverErrorContext.Provider;
export const useServerErrorContext = () => useContext(serverErrorContext);
