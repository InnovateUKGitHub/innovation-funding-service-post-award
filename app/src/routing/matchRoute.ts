import { State } from "router5";
import { IAsyncRoute, routeConfig } from "./routeConfig";
import { Home } from "../containers";

export function matchRoute(route: State | undefined): IAsyncRoute {
  const name  = !route ? "error" : route.name;
  const match = routeConfig.find(x => x.name === name);

  return !!match ? match : {
    name: 'home',
    path: '/',
    component: Home,
    loadData: () => Promise.resolve({})
  };
}

export function matchRouteLoader(route: State | undefined) {
  const match = matchRoute(route);
  return !!match.loadData ? match.loadData : () => Promise.resolve({});
}
