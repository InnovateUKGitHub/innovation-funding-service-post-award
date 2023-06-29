import { useStores } from "@ui/redux/storesProvider";

/**
 * @description This ensures all POST requests are authentic and to prevents Cross-Site Request Forgery (CSRF) attacks.
 *
 * Omitting this input will result in failed POST requests due to a missing form value, due to server middleware!
 */
export function SecurityTokenInput() {
  const stores = useStores();
  const { csrf } = stores.users.getCurrentUser();

  return <input type="hidden" name="_csrf" value={csrf} />;
}
