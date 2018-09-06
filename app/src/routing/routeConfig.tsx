import React from "react";
import { Route } from "router5";
import { AsyncThunk } from "../redux/actions";
import * as Containers from "../containers";
import * as Actions from "../redux/actions/contacts";

export interface AsyncRoute extends Route {
  component: React.ComponentType<any>;
  loadData?: (route?: any) => AsyncThunk<any>[];
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
  loadData: () => [Actions.loadProjects()]
};

const projectDetailsRoute: AsyncRoute = {
  name: "projectDetails",
  path: "/project/details/:id",
  component: Containers.ProjectDetails,
  loadData: (route) => {
      const projectId = route.params && route.params.id;
      return [
        Actions.loadProject(projectId),
        Actions.loadContactsForProject(projectId),
        Actions.loadPatnersForProject(projectId)
      ];
    }
};

const contactsRoute: AsyncRoute = {
  name: "contacts",
  path: "/contacts",
  component: Containers.ContactList,
  loadData: () => [Actions.loadContacts()]
};

const claimsDashboardRoute: AsyncRoute = {
  name: "projectClaims",
  path: "/project/claims/:id",
  component: Containers.ClaimsDashboard,
  loadData: (route) => {
      console.log(1);
      const projectId = route.params && route.params.id;
      return [
          Actions.loadProject(projectId)
      ];
  }
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
  error: errorRoute,
};
