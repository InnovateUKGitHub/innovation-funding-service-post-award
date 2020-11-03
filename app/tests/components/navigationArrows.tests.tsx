// tslint:disable:no-duplicate-string
import React from "react";
import { mount } from "enzyme";

import { NavigationArrows } from "../../src/ui/components";
import { createStore } from "redux";
import { rootReducer } from "../../src/ui/redux/reducers";
import { RouterProvider } from "react-router5";
import { Provider } from "react-redux";
import { IClientUser, ProjectRole } from "@framework/types";
import { configureRouter, routeConfig } from "@ui/routing";

const routes = routeConfig;
const router = configureRouter(routes);

const previousLink = {
  label: "Overheads",
  route: routes.reviewClaimLineItems.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYZQA2"
  })
};

const nextLink = {
  label: "Labour",
  route: routes.reviewClaimLineItems.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYYQA2"
  })
};

const preloadedState: IClientUser = {
  email: "iuk.accproject@bjss.com.bjsspoc2",
  roleInfo: {
    a0C0Q000001tr5yUAA: {
      projectRoles: ProjectRole.MonitoringOfficer,
      partnerRoles: {}
    }
  },
  csrf: "CSFR"

};

describe("NavigationArrows", () => {
  it("renders only the next arrow if no previous link is given", () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer, { user: preloadedState })}>
        <RouterProvider router={router}>
          <NavigationArrows previousLink={null} nextLink={nextLink} />
        </RouterProvider>
      </Provider>
    );

    expect(wrapper.find("a").length).toEqual(1);
    expect(wrapper.find("a").find("span").at(0).text()).toEqual("Next");
    expect(wrapper.find("a").find("span").at(1).text()).toEqual(nextLink.label);
  });

  it("renders the previous and the next arrow", () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer, { user: preloadedState })}>
        <RouterProvider router={router}>
          <NavigationArrows previousLink={previousLink} nextLink={nextLink} />
        </RouterProvider>
      </Provider>
    );

    expect(wrapper.find("a").length).toEqual(2);

    expect(wrapper.find("a").at(0).find("span").at(0).text()).toEqual("Previous");
    expect(wrapper.find("a").at(0).find("span").at(1).text()).toEqual(previousLink.label);

    expect(wrapper.find("a").at(1).find("span").at(0).text()).toEqual("Next");
    expect(wrapper.find("a").at(1).find("span").at(1).text()).toEqual(nextLink.label);
  });

  it("renders only the previous arrow if no next link is given", () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer, { user: preloadedState })}>
        <RouterProvider router={router}>
          <NavigationArrows previousLink={previousLink} nextLink={null} />
        </RouterProvider>
      </Provider>
    );

    expect(wrapper.find("a").length).toEqual(1);
    expect(wrapper.find("a").find("span").at(0).text()).toEqual("Previous");
    expect(wrapper.find("a").find("span").at(1).text()).toEqual(previousLink.label);
  });

  it("renders no arrows if no links are given", () => {
    const wrapper = mount(
      <Provider store={createStore(rootReducer, { user: preloadedState })}>
        <RouterProvider router={router}>
          <NavigationArrows previousLink={null} nextLink={null} />
        </RouterProvider>
      </Provider>
    );

    expect(wrapper.find("a").length).toEqual(0);
  });
});
