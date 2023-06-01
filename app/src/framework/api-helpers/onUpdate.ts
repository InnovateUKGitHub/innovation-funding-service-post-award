import { isApiError } from "@framework/util/errorHelpers";
import { useApiErrorContext } from "@ui/context/api-error";
import { noop } from "@ui/helpers/noop";
import { useState } from "react";
import { Logger } from "@shared/developmentLogger";

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

export const useOnUpdate = <TFormValues, TPromise>({
  req,
  onSuccess = noop,
  onError = noop,
}: {
  req: (data: TFormValues) => TPromise;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const serverRenderedApiError = useApiErrorContext();
  const [apiError, setApiError] = useState(serverRenderedApiError);

  const onUpdate = async (data: TFormValues) => {
    try {
      await req(data);
      onSuccess();
    } catch (e: unknown) {
      const logger = new Logger("onUpdate");

      if (isApiError(e)) {
        setApiError(e);
      }

      logger.error("request error", e);
      onError();
    }
  };

  return { onUpdate, apiError };
};
