import React from "react";
import { Breadcrumbs } from "@ui/components";
import { createStore } from "redux";
import { rootReducer } from "@ui/redux";
import { RouterProvider } from "react-router5";
import { Provider } from "react-redux";
import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { IGuide } from "@framework/types";

const links = [
  {
    text: "Dashboard",
    routeName: "route 1",
    routeParams: {}
  },
  {
    text: "Claims",
    routeName: "route 2",
    routeParams: {}
  },
  {
    text: "Documents",
    routeName: "route 2",
    routeParams: {}
  },
  {
    text: "Delete",
    routeName: "route 2",
    routeParams: {}
  },
];

const route = { name: "test", path: "/components" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

export const breadcrumbsGuide: IGuide = {
  name: "Breadcrumbs",
  options: [
    {
      name: "Breadcrumbs navigation",
      comments: "Renders the initial links followed by child",
      example: `<Breadcrumbs links={links}>Current page</Breadcrumbs>`,
      render: () =>(
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Breadcrumbs links={links}>Current page</Breadcrumbs>
          </RouterProvider>
        </Provider>
      )
    }
  ]
};
