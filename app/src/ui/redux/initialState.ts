import { State as RouterState } from "router5";
import { RootState } from "./reducers/rootReducer";
import { IClientUser } from "@framework/types/IUser";
import { IClientConfig } from "./reducers/configReducer";

export function setupInitialState(route: RouterState | undefined, user: IClientUser, config: IClientConfig): RootState {
  return {
    user,
    router: { route },
    data: {
    },
    loadStatus: 0,
    isClient: false,
    config
  } as RootState;
}
