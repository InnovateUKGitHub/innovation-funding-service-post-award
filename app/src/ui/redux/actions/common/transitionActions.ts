import { createAction } from "./createAction";

export type TransitionActions = RouteTransition;
type RouteTransition = ReturnType<typeof routeTransition>;

export type NavigationType = "PUSH" | "POP" | "REPLACE";

export const routeTransition = (navigationType?: NavigationType) => createAction("ROUTE_TRANSITION", navigationType);
