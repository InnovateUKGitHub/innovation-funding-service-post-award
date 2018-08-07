import { State } from "router5";
import { RootState } from "./reducers/rootReducer";

export function setupInitialState(route: State | undefined): RootState {
  if(!route) {
    route = {
      name: "error",
      params: {},
      path: "/path"
    };
  }

  return {
    router: { route },
    data: {
      contacts: {}
    }
  } as any;
}
