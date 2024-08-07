import { ClientErrorResponse } from "@server/errorHandlers";
import { ZodIssue } from "zod";

declare namespace Express {
  export interface Locals {
    nonce: string;
    isMatchedRoute?: boolean;
    isFormSuccess?: boolean;
    preloadedReduxActions: { type: string; payload?: unknown }[];
    preloadedData: AnyObject;
    preloadedServerErrors: ClientErrorResponse | null;
    messages: string[];
    serverZodErrors: ZodIssue[];
  }
}
