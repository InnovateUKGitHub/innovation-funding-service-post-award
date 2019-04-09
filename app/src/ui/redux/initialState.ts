import { State as RouterState } from "router5";
import { RootState } from "./reducers/rootReducer";
import { IClientUser } from "../../types/IUser";
import { IConfig } from "../../server/features/common";

export function setupInitialState(route: RouterState | undefined, user: IClientUser, config: IConfig): RootState {
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
    config:{
      ifsRoot: config.urls.ifsRoot,
      features: config.features,
      standardOverheadRate: config.standardOverheadRate,
    }
  } as RootState;
}
