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
