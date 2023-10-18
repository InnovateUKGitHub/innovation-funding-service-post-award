import { isApiError } from "@framework/util/errorHelpers";
import { useApiErrorContext } from "@ui/context/api-error";
import { noop } from "@ui/helpers/noop";
import { useState } from "react";
import { Logger } from "@shared/developmentLogger";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";

export enum Propagation {
  STOP,
}

/**
 * ### useOnUpdate
 * Takes an update api call and an optional onSuccess and onError callback.
 *
 * It returns an object with the onUpdate function and apiError response.
 * apiError is also initialised with any serverRenderedApiError, mainly
 * to support js disabled
 *
 * @returns an object with `onUpdate` function and `apiError` response
 */

export const useOnUpdate = <TFormValues, TResponse, TContext = undefined>({
  req,
  onSuccess = noop,
  onError = noop,
}: {
  req: (data: TFormValues, context?: TContext) => Promise<TResponse>;
  onSuccess?: (data: TFormValues, res: TResponse, context?: TContext) => void;
  onError?: (e: unknown) => Propagation | void;
}) => {
  const serverRenderedApiError = useApiErrorContext();
  const [apiError, setApiError] = useState(serverRenderedApiError);
  const [isFetching, setIsFetching] = useState(false);

  const onUpdate = async ({ data, context }: { data: TFormValues; context?: TContext }) => {
    try {
      setIsFetching(true);
      setApiError(null);

      const res = await req(data, context);

      setIsFetching(false);
      onSuccess(data, res, context);
    } catch (e: unknown) {
      const logger = new Logger("onUpdate");

      setIsFetching(false);

      logger.error("request error", e);

      // Check if we want to cancel the `setApiError` call
      const propagation = onError(e);

      // If not cancelled and is an api error...
      if (propagation !== Propagation.STOP && isApiError(e)) {
        setApiError(e);
        scrollToTheTopSmoothly();
      }
    }
  };

  return { onUpdate, apiError, isFetching };
};
