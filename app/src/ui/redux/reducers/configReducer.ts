import { IAppOptions } from "@framework/types/IAppOptions";
import { IFeatureFlags, LogLevel } from "@framework/types";

export interface IClientConfig {
  ifsRoot: string;
  features: IFeatureFlags;
  options: IAppOptions;
  ssoEnabled: boolean;
  logLevel: LogLevel;
}

export const configReducer = (state: IClientConfig = {} as IClientConfig) => {
  // no update on client side this is initialised from server
  return state;
};
