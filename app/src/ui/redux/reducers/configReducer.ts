import { RootActions } from "../actions/root";
import { IAppOptions } from "@framework/types/IAppOptions";

export interface IClientConfig {
  ifsRoot: string;
  features: IFeatureFlags;
  options: IAppOptions;
  ssoEnabled: boolean;
}

export const configReducer = (state: IClientConfig  = {} as IClientConfig , action: RootActions) => {
  // no update on client side this is initialised from server
  return state;
};
