import { State } from "router5";
import { IStore } from "./store";

export function setupInitialState(route: State | undefined): IStore {
  if(!route) {
    route = {
      name: "error",
      params: {},
      path: "/path"
    };
  }

  return {
    router: { route }
  }
}
