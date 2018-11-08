import { State } from "router5";
import { RootState } from "./reducers/rootReducer";

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
    loadStatus: 0
  } as RootState;
}
