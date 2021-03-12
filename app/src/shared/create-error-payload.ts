import { IAppError } from "@framework/types";

/**
 * @description Convert internal Error into consistent signature for the UI
 */
export const createErrorPayload = (appError: IAppError, isNotFound: boolean) => ({
  name: isNotFound ? "errorNotFound" : "error",
  params: {
    errorCode: appError.code,
    errorType: appError.message,
  },
  path: "",
});
