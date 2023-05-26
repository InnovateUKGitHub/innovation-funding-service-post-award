import { IAppError } from "@framework/types";
import { isApiError } from "@framework/util/errorHelpers";
import { noop } from "@ui/helpers/noop";
import { useState } from "react";

/**
 * ### useOnUpdate
 * Takes an update api call and an optional onSuccess and onError callback.
 *
 * It returns an object with the onUpdate function and apiError response.
 * apiError is also initialised with any serverRenderedApiError, mainly
 * to support js disabled
 *
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
  const [apiError, setApiError] = useState<IAppError | null>(null);

  const onUpdate = async (data: TFormValues) => {
    try {
      await req(data);
      onSuccess();
    } catch (e: unknown) {
      if (isApiError(e)) {
        setApiError(e);
      }
      onError();
    }
  };

  return { onUpdate, apiError };
};
