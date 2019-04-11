// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { NavigationArrows } from "../../src/ui/components";
import { ReviewClaimLineItemsRoute } from "../../src/ui/containers/claims";
import { createStore } from "redux";
import { rootReducer } from "../../src/ui/redux/reducers";
import { RouterProvider } from "react-router5";
import { Provider } from "react-redux";
import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { IClientUser, ProjectRole } from "../../src/types";

Enzyme.configure({ adapter: new Adapter() });

const previousLink = {
  label: "Overheads",
  route: ReviewClaimLineItemsRoute.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYZQA2"
  })
};

const nextLink = {
  label: "Labour",
  route: ReviewClaimLineItemsRoute.getLink({
    partnerId: "a0B0Q000001e3HdUAI",
    projectId: "a0C0Q000001tr5yUAA",
    periodId: 2,
    costCategoryId: "a060Q000000oAYYQA2"
  })
};

const route = { name: "test", path: "/test" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

const preloadedState: IClientUser = {
  email: "iuk.accproject@bjss.com.bjsspoc2",
  roleInfo: {
    a0C0Q000001tr5yUAA: {
      projectRoles: ProjectRole.MonitoringOfficer,
      partnerRoles: {}
    }
  }
};
describe("NavigationArrows", () => {
  it("renders only the next arrow if no previous link is given", () => {
    const wrapper = mount(
  <Provider store={createStore(rootReducer, {user: preloadedState})}>
          <RouterProvider router={router}>
            <NavigationArrows previousLink={null} nextLink={nextLink}/>
          </RouterProvider>
        </Provider>
    );

    expect(wrapper.find("a").length).toEqual(1);
    expect(wrapper.find("a").find("span").at(0).text()).toEqual("Next");
    expect(wrapper.find("a").find("span").at(1).text()).toEqual(nextLink.label);
  });

  it("renders the previous and the next arrow", () => {
    const wrapper = mount(
<Provider store={createStore(rootReducer, {user: preloadedState})}>
        <RouterProvider router={router}>
          <NavigationArrows previousLink={previousLink} nextLink={nextLink}/>
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
<Provider store={createStore(rootReducer, {user: preloadedState})}>
        <RouterProvider router={router}>
          <NavigationArrows previousLink={previousLink} nextLink={null}/>
        </RouterProvider>
      </Provider>
    );

    expect(wrapper.find("a").length).toEqual(1);
    expect(wrapper.find("a").find("span").at(0).text()).toEqual("Previous");
    expect(wrapper.find("a").find("span").at(1).text()).toEqual(previousLink.label);
  });

  it("renders no arrows if no links are given", () => {
    const wrapper = mount(
<Provider store={createStore(rootReducer, {user: preloadedState})}>
        <RouterProvider router={router}>
          <NavigationArrows previousLink={null} nextLink={null}/>
        </RouterProvider>
      </Provider>
    );

    expect(wrapper.find("a").length).toEqual(0);
  });
});
