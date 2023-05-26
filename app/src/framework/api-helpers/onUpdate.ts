import { IAppError } from "@framework/types";
import { isApiError } from "@framework/util/errorHelpers";
import { noop } from "@ui/helpers/noop";
import { useState } from "react";

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
