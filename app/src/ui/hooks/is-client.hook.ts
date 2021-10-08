import { useStores } from "@ui/redux";

export function useIsClient() {
  return useStores().config.isClient();
}
