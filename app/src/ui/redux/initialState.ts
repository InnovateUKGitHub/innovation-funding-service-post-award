import { IClientUser } from "@framework/types/IUser";
import { RootState } from "./reducers/rootReducer";
import { IClientConfig } from "./reducers/configReducer";

/**
 * initializes the redux state
 */
export function setupInitialState(user: IClientUser, config: IClientConfig): RootState {
  return {
    user,
    data: {},
    loadStatus: 0,
    config,
    globalError: null,
  } as RootState;
}
