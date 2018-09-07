import React from "react";
import { Route } from "router5";
import { AsyncThunk } from "../redux/actions";
import { State } from "router5";
import * as Containers from "../containers";

export interface AsyncRoute extends Route {
  component: React.ComponentType<any> & { getLoadDataActions?: (route: State) => AsyncThunk<any>[]};
}

export type RouteKeys = keyof typeof routeConfig;

const homeRoute: AsyncRoute = {
  name: "home",
  path: "/",
  component: Containers.Home
};

const projectDashboardRoute: AsyncRoute = {
  name: "projectDashboard",
  path: "/project/dashboard",
  component: Containers.ProjectDashboard,
};

const projectDetailsRoute: AsyncRoute = {
  name: "projectDetails",
  path: "/project/details/:id",
  component: Containers.ProjectDetails,
};

const contactsRoute: AsyncRoute = {
  name: "contacts",
  path: "/contacts",
  component: Containers.ContactList,
};

const claimsDashboardRoute: AsyncRoute = {
  name: "projectClaims",
  path: "/project/claims/:id",
  component: Containers.ClaimsDashboard
};

const errorRoute: AsyncRoute = {
  name: "error",
  path: "/error",
  component: Containers.Home
};

export const routeConfig = {
  home: homeRoute,
  projectDashboard: projectDashboardRoute,
  projectDetails: projectDetailsRoute,
  contacts: contactsRoute,
  projectClaims: claimsDashboardRoute,
  error: errorRoute
};
