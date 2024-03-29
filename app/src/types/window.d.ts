import { IAppError } from "@framework/types/IAppError";
import { IClientConfig } from "src/types/IClientConfig";
import { Result } from "@ui/validation/result";
import { i18n } from "i18next";
import { SSRCache } from "react-relay-network-modern-ssr/node8/server";

declare global {
  interface Window {
    __CLIENT_CONFIG__: IClientConfig;
    __PRELOADED_STATE__: AnyObject;
    __RELAY_BOOTSTRAP_DATA__: SSRCache;
    i18n: i18n;
    __PAGE_LOAD_STATUS__: boolean;
    __PRELOADED_FORM_ERRORS__: Result[];
    __PRELOADED_API_ERRORS__: IAppError;
  }
}
