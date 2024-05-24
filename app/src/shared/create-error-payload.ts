import { IAppError } from "@framework/types/IAppError";
import { ErrorTypes } from "@ui/components/atomicDesign/organisms/ErrorContainer/utils/error.config";
import { ErrorNotFoundRoute, ErrorRoute } from "@ui/containers/errors.page";

export interface ErrorPayload {
  name: string;
  params: {
    errorCode: IAppError["code"];
    errorType: ErrorTypes | string;
    errorMessage?: IAppError["message"];
    errorStack?: IAppError["stack"];
    errorDetails?: IAppError["details"];
  };
  path: string;
}

/**
 * @description Convert internal Error into consistent signature for the UI
 */
export const createErrorPayload = (appError: IAppError, isNotFound: boolean): ErrorPayload => {
  const errorRouteName = isNotFound ? ErrorNotFoundRoute.routeName : ErrorRoute.routeName;

  const uppercaseAndUnderscoreRegex = /^[A-Z]+(?:_[A-Z]+)*$/;
  const isInternalError = uppercaseAndUnderscoreRegex.test(appError.message);

  return {
    name: errorRouteName,
    params: {
      errorCode: appError.code,
      errorType: isInternalError ? appError.message : "",
      errorMessage: appError.message,
      errorStack: appError.stack,
    },
    path: "",
  };
};
