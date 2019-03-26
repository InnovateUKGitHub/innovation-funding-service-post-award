import { State } from "router5";
import { RootState } from "./reducers/rootReducer";
import { IClientUser } from "../../types/IUser";
import { Configuration } from "../../server/features/common";

export function setupInitialState(route: State | undefined, user: IClientUser): RootState {
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
      ifsRoot: Configuration.urls.ifsRoot
    }
  } as RootState;
}
