import { State } from "router5";
import { RootState } from "./reducers/rootReducer";
import { IUser } from "../../types/IUser";
import { Configuration } from "../../server/features/common";

export function setupInitialState(route: State | undefined, user: IUser): RootState {
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
