import { ServerError } from "@ui/context/server-error";
import { ZodIssue } from "zod";

declare namespace Express {
  export interface Locals {
    nonce: string;
    isMatchedRoute?: boolean;
    isFormSuccess?: boolean;
    preloadedReduxActions: { type: string; payload?: unknown }[];
    preloadedData: AnyObject;
    preloadedServerErrors: ServerError | null | undefined;
    messages: string[];
    serverZodErrors: ZodIssue[];
  }
}
