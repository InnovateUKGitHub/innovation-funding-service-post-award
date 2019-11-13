import React from "react";
import {NavigationArrows} from "../components";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {rootReducer} from "../redux/reducers";
import { RouterProvider } from "react-router5";
import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { ILinkInfo } from "@framework/types";

const route = { name: "test", path: "/components" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

interface DummyLink {
  label: string;
  route: ILinkInfo;
}

const previousLink: DummyLink = {
  label: "The previous item",
  route: {
    routeName: route.name,
    routeParams: {},
    accessControl: () => true
  },
};

const nextLink: DummyLink = {
  label: "The next item",
  route: {
    routeName: route.name,
    routeParams: {},
    accessControl: () => true
  },
};

export const navigationArrowsGuide: IGuide = {
  name: "Navigation arrows",
  options: [
    {
      name: "First cost category",
      comments: "Renders only the 'Next' arrow",
      example: `<NavigationArrows previousLink={null} nextLink={nextLink} />`,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <NavigationArrows previousLink={null} nextLink={nextLink}/>
          </RouterProvider>
        </Provider>
      )
    },
    {
      name: "Middle cost category",
      comments: "Renders the 'Next' & 'Previous' arrows",
      example: `<NavigationArrows previousLink={previousLink} nextLink={previousLink} />`,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <NavigationArrows previousLink={previousLink} nextLink={nextLink} />
          </RouterProvider>
        </Provider>
      )
    },
    {
      name: "Last cost category",
      comments: "Renders only the 'Previous' arrow",
      example: `<NavigationArrows previousLink={previousLink} nextLink={null} />`,
      render: () => (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <NavigationArrows previousLink={previousLink} nextLink={null}/>
          </RouterProvider>
        </Provider>
      )
    }
  ]
};
