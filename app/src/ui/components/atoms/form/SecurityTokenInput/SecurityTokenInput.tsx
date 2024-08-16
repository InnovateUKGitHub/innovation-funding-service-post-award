import { useUserContext } from "@ui/context/user";

/**
 * @description This ensures all POST requests are authentic and to prevents Cross-Site Request Forgery (CSRF) attacks.
 *
 * Omitting this input will result in failed POST requests due to a missing form value, due to server middleware!
 */
export function SecurityTokenInput() {
  const { csrf } = useUserContext();

  return <input type="hidden" name="_csrf" value={csrf} />;
}
