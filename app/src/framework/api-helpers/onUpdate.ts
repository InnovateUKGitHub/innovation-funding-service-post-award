import { useApiErrorContext } from "@ui/context/api-error";
import noop from "lodash/noop";
import { useState } from "react";
import { Logger } from "@shared/developmentLogger";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { ClientErrorResponse } from "@framework/util/errorHandlers";

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
  onSuccess?: (data: TFormValues, res: TResponse, context?: TContext) => void | Promise<void>;
  onError?: (e: unknown) => Propagation | void;
}) => {
  const serverRenderedApiError = useApiErrorContext();
  const [apiError, setApiError] = useState(serverRenderedApiError);
  const [isFetching, setIsFetching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onUpdate = async ({ data, context }: { data: TFormValues; context?: TContext }) => {
    try {
      setIsFetching(true);
      setIsProcessing(true);

      setApiError(null);

      const res = await req(data, context);

      setIsFetching(false);
      await onSuccess(data, res, context);
      setIsProcessing(false);
    } catch (e: unknown) {
      const logger = new Logger("onUpdate");

      setIsFetching(false);

      logger.error("request error", e);

      // Check if we want to cancel the `setApiError` call
      const propagation = onError(e);

      // If not cancelled and is an api error...
      if (propagation !== Propagation.STOP) {
        setApiError(e as unknown as ClientErrorResponse);
        scrollToTheTopSmoothly();
      }

      setIsProcessing(false);
    }
  };

  return { onUpdate, apiError, isFetching, isProcessing };
};
