import { State as RouterState } from "router5";
import { RootState } from "./reducers/rootReducer";
import { IClientUser } from "@framework/types/IUser";
import { IConfig } from "../../server/features/common";
import { IClientConfig } from "./reducers/configReducer";

export function setupInitialState(route: RouterState | undefined, user: IClientUser, config: IClientConfig): RootState {
  if(!route) {
    route = {
      name: "error",
      params: {},
      path: "/path"
    };
  }

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
