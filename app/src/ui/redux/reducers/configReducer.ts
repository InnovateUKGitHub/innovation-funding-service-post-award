import { IClientConfig } from "../../../types/IClientConfig";

export const configReducer = (state: IClientConfig = {} as IClientConfig) => {
  // no update on client side this is initialised from server
  return state;
};
