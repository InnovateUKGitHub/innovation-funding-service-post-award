import React from "react";
import { Route } from "router5";
import { AsyncThunk } from "../redux/actions";
import * as Containers from "../containers";
import { loadContacts } from "../redux/actions/contacts";

export interface AsyncRoute extends Route {
  component: React.ComponentType<any>;
  loadData?: AsyncThunk<any>;
}

export type RouteKeys = keyof typeof routeConfig;

const homeRoute: AsyncRoute = {
  name: "home",
  path: "/",
  component: Containers.Home,
  loadData: () => Promise.resolve({})
};

const projectDetailsRoute: AsyncRoute = {
  name: "projectDetails",
  path: "/project/details",
  component: Containers.ProjectDetails
};

const contactsRoute: AsyncRoute = {
  name: "contacts",
  path: "/contacts",
  component: Containers.ContactList,
  loadData: loadContacts()
};

const errorRoute: AsyncRoute = {
  name: "error",
  path: "/error",
  component: Containers.Home,
  loadData: () => Promise.resolve({})
};

export const routeConfig = {
  home: homeRoute,
  projectDetails: projectDetailsRoute,
  contacts: contactsRoute,
  error: errorRoute,
};
