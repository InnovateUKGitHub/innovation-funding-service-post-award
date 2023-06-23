import { IClientUser } from "@framework/types/IUser";
import { IClientConfig } from "src/types/IClientConfig";
import { RootState } from "./reducers/rootReducer";

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
