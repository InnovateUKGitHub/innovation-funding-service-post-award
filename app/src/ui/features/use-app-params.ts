import { useParams, useSearchParams } from "react-router-dom";

/**
 * Creates an object from url params, if you provide a type, it will be typed :)
 */
export function useAppParams<T extends AnyObject & { projectId?: string }>(): T {
  const urlParams = useParams();
  const [params] = useSearchParams();
  const urlParam = new URLSearchParams(params);

  const queryParams = Object.fromEntries(urlParam) as unknown as T;

  // TODO: Add logic check to stop queryParams overriding urlParams - throwing an error here would simple as it would tell the dev any accidental overlay
  return {
    ...urlParams,
    ...queryParams,
  };
}
