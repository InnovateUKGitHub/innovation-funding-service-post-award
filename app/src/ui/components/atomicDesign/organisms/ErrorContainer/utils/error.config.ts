import React from "react";
import { UnauthenticatedError } from "../../../../../containers/pages/error/Unauthenticated/UnauthenticatedError";
import { GenericFallbackError } from "../../../../../containers/pages/error/Generic/GenericFallbackError";
import { NotFoundError } from "../../../../../containers/pages/error/NotFound/NotFoundError";

/**
 * @description Treat error messaging as unique key lookup, the type should be string.
 *
 * To ensure that we can scale the error handling, there maybe keys we do not have content for... In this we have a fallback
 */
export type InternalErrorTypes = "AUTHENTICATION_ERROR" | "NOT_FOUND";
export type ErrorTypes = InternalErrorTypes & "INTERNAL_ERROR_FALLBACK";

type ErrorConfig = Record<InternalErrorTypes, React.ElementType>;

export const internalErrorFallback: typeof GenericFallbackError = GenericFallbackError;

export const errorPages: ErrorConfig = {
  AUTHENTICATION_ERROR: UnauthenticatedError,
  NOT_FOUND: NotFoundError,
};
