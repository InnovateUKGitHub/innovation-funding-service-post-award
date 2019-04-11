import React from "react";
import {NavigationArrows} from "../components";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {rootReducer} from "../redux/reducers";
import { RouterProvider } from "react-router5";
import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { ReviewClaimLineItemsRoute } from "../containers/claims";
import { IClientUser, ProjectRole } from "../../types";

const route = { name: "test", path: "/test" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

const previousLink = {
  label: "Overheads",
  route: ReviewClaimLineItemsRoute.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYZQA2"
  }),
};

const nextLink = {
  label: "Labour",
  route: ReviewClaimLineItemsRoute.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYYQA2"
  }),
};

const preloadedState: IClientUser = {
  email: "iuk.accproject@bjss.com.bjsspoc2",
  roleInfo: {
    a0C0Q000001tr5yUAA: {
      projectRoles: ProjectRole.MonitoringOfficer,
      partnerRoles: {}
    }
  }
};

export const navigationArrowsGuide: IGuide = {
  name: "Navigation arrows",
  options: [
    {
      name: "First cost category",
      comments: "Renders only the 'Next' arrow",
      example: `<NavigationArrows previousLink={null} nextLink={nextLink} />`,
      render: () => (
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
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
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
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
        <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <NavigationArrows previousLink={previousLink} nextLink={null}/>
          </RouterProvider>
        </Provider>
      )
    }
  ]
};
