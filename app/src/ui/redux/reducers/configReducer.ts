import { LogLevel } from "@framework/constants/enums";
import { IAppOptions } from "@framework/types/IAppOptions";
import { IFeatureFlags } from "@framework/types/IFeaturesFlags";

export interface IClientConfig {
  ifsRoot: string;
  features: IFeatureFlags;
  options: IAppOptions;
  ssoEnabled: boolean;
  logLevel: LogLevel | string;
}

export const configReducer = (state: IClientConfig = {} as IClientConfig) => {
  // no update on client side this is initialised from server
  return state;
};
