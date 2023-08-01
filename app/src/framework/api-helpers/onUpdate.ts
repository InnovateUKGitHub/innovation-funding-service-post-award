import { isApiError } from "@framework/util/errorHelpers";
import { useApiErrorContext } from "@ui/context/api-error";
import { noop } from "@ui/helpers/noop";
import { useState } from "react";
import { Logger } from "@shared/developmentLogger";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";

// so sad - hopefully this can be improved but unfortunately we are
// restricted by the fact that the event type in React Hook Form `form.d.ts`
// is the BaseSyntheticEvent with only the default generic types
type OnUpdateEvent = any;

// type OnUpdateEvent = SyntheticEvent<HTMLFormElement, SubmitEvent> | undefined;

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
export function useOnUpdate<TFormValues, TResponse>({
  req,
  onSuccess = noop,
  onError = noop,
}: {
  req: (data: TFormValues, submitEvent?: OnUpdateEvent) => Promise<TResponse>;
  onSuccess?: ({ data, response }: { data: TFormValues; response: TResponse }, submitEvent?: OnUpdateEvent) => void;
  onError?: (e: unknown) => void;
}) {
  const serverRenderedApiError = useApiErrorContext();
  const [apiError, setApiError] = useState(serverRenderedApiError);
  const [isFetching, setIsFetching] = useState(false);

  /**
   * This is the return onUpdate handler that is passed into the react hook form handleSubmit function
   */
  async function onUpdate(data: TFormValues, submitEvent?: OnUpdateEvent) {
    try {
      setIsFetching(true);

      const response = await req(data, submitEvent);
      setIsFetching(false);
      onSuccess({ data, response }, submitEvent);
    } catch (e: unknown) {
      const logger = new Logger("onUpdate");

      if (isApiError(e)) {
        setApiError(e);
        scrollToTheTopSmoothly();
      }

      setIsFetching(false);

      logger.error("request error", e);
      onError(e);
    }
  }

  return { onUpdate, apiError, isFetching };
}

/**
 * ### useOnUpdateWithOptions
 * Takes an update api call and an optional onSuccess and onError callback.
 *
 * It returns an object with the onUpdate function and apiError response.
 * apiError is also initialised with any serverRenderedApiError, mainly
 * to support js disabled
 *
 * @returns an object with `onUpdate` function and `apiError` response
 */
export function useOnUpdateWithOptions<TFormValues, TResponse, TOptions = undefined>({
  req,
  onSuccess = noop,
  onError = noop,
}: {
  req: (data: TFormValues, options?: TOptions, submitEvent?: OnUpdateEvent) => Promise<TResponse>;
  onSuccess?: (
    { data, response, options }: { data: TFormValues; response: TResponse; options: TOptions },
    submitEvent?: OnUpdateEvent,
  ) => void;
  onError?: (e: unknown) => void;
}) {
  const serverRenderedApiError = useApiErrorContext();
  const [apiError, setApiError] = useState(serverRenderedApiError);
  const [isFetching, setIsFetching] = useState(false);

  /**
   * This is the return onUpdate handler that is passed into the react hook form handleSubmit function
   */
  async function onUpdate(options: TOptions) {
    return async function (data: TFormValues, submitEvent?: OnUpdateEvent) {
      try {
        setIsFetching(true);
        const response = await req(data, options, submitEvent);
        setIsFetching(false);
        onSuccess({ data, response, options }, submitEvent);
      } catch (e: unknown) {
        const logger = new Logger("onUpdate");

        if (isApiError(e)) {
          setApiError(e);
          scrollToTheTopSmoothly();
        }

        setIsFetching(false);

        logger.error("request error", e);
        onError(e);
      }
    };
  }
  return { onUpdate, apiError, isFetching };
}
