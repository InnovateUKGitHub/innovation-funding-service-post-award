import React from "react";
import { Route } from "router5";
import { AsyncThunk } from "../redux/actions";
import * as Containers from "../containers";
import * as Actions from "../redux/actions/contacts";

export interface AsyncRoute extends Route {
  component: React.ComponentType<any>;
  loadData?: () => AsyncThunk<any>[];
}

export type RouteKeys = keyof typeof routeConfig;

const homeRoute: AsyncRoute = {
  name: "home",
  path: "/",
  component: Containers.Home
};

const projectDetailsRoute: AsyncRoute = {
  name: "projectDetails",
  path: "/project/details",
  component: Containers.ProjectDetails,
  loadData: () => {
      const projectId = "ToDo";
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

const errorRoute: AsyncRoute = {
  name: "error",
  path: "/error",
  component: Containers.Home
};

export const routeConfig = {
  home: homeRoute,
  projectDetails: projectDetailsRoute,
  contacts: contactsRoute,
  error: errorRoute,
};
