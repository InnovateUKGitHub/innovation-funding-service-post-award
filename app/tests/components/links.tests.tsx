// tslint:disable:no-identical-functions
import React from "react";
import * as Links from "../../src/ui/components/links";
import { mount } from "enzyme";

import { RouterProvider } from "react-router5";
import { createRouter } from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../src/ui/redux/reducers";

const route = { routeName: "test", routeParams: { id : "exampleId"}, accessControl: () => true};
const router = createRouter([{name: route.routeName, path: "/test/:id" }]).usePlugin(browserPluginFactory({ useHash: false }));
const expectedPath = "/test/exampleId";

describe("Links", () => {
  describe("Link", () => {
    it("should render a link with correct path", () => {
      const linkText = "someLinkText";
      const result = (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.Link route={route}>{linkText}</Links.Link>
          </RouterProvider>
        </Provider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain("/test/exampleId");
    });

    it("should render a link with correct class", () => {
      const linkText = "someLinkText";
      const result = (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.Link route={route}>{linkText}</Links.Link>
          </RouterProvider>
        </Provider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain("govuk-link");
    });

    it("should render a link with correct children", () => {
      const linkText = "someLinkText";
      const result = (
        <Provider store={createStore(rootReducer)}>
          <RouterProvider router={router}>
            <Links.Link route={route}>{linkText}</Links.Link>
          </RouterProvider>
        </Provider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain(linkText);
    });
  });

  describe("BackLink", () => {
    it("should render a link with correct path", () => {
      const linkText = "someLinkText";
      const result = (
        <RouterProvider router={router}>
          <Links.BackLink route={route}>{linkText}</Links.BackLink>
        </RouterProvider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain(expectedPath);
    });

    it("should render a link with correct class", () => {
      const linkText = "someLinkText";
      const result = (
        <RouterProvider router={router}>
          <Links.BackLink route={route}>{linkText}</Links.BackLink>
        </RouterProvider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain("govuk-back-link");
    });

    it("should render a link with correct children", () => {
      const linkText = "someLinkText";
      const result = (
        <RouterProvider router={router}>
          <Links.BackLink route={route}>{linkText}</Links.BackLink>
        </RouterProvider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain(linkText);
    });
  });

});
