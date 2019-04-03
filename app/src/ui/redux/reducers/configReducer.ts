import { RootActions } from "../actions/root";

export interface IClientConfig {
  ifsRoot: string;
  features: IFeatureFlags;
}

export const configReducer = (state: IClientConfig  = {} as IClientConfig , action: RootActions) => {
  // no update on client side this is initialised from server
  return state;
};
