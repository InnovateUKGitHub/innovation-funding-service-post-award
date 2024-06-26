import { IAppError } from "@framework/types/IAppError";
import { IClientConfig } from "./IClientConfig";
import { Result } from "@ui/validation/result";
import { i18n } from "i18next";
import { SSRCache } from "react-relay-network-modern-ssr/node8/server";
import { IClientUser } from "@framework/types/IUser";
import { ZodIssue } from "zod";

declare global {
  interface Window {
    __CLIENT_CONFIG__: IClientConfig;
    __PRELOADED_STATE__: AnyObject;
    __RELAY_BOOTSTRAP_DATA__: SSRCache;
    i18n: i18n;
    __PAGE_LOAD_STATUS__: boolean;
    __PRELOADED_FORM_ERRORS__: Result[];
    __PRELOADED_API_ERRORS__: IAppError;
    __PRELOADED_MESSAGES__: string[] | undefined;
    __USER_CONFIG__: IClientUser;
    __PRELOADED_SERVER_ZOD_ERRORS__: ZodIssue[] | undefined;
  }
}
