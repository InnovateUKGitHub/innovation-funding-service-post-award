import { i18n } from "i18next";
import { SSRCache } from "react-relay-network-modern-ssr/node8/server";

declare global {
  interface Window {
    __PRELOADED_STATE__: AnyObject;
    __RELAY_BOOTSTRAP_DATA__: SSRCache;
    i18n: i18n;
    __PAGE_LOAD_STATUS__: boolean;
  }
}
