import "jest";
import React from "react";
import * as Links from "../../src/components/links";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { RouterProvider } from "react-router5";
import { createRouter } from "router5";
import browserPluginFactory from "router5/plugins/browser";

Enzyme.configure({ adapter: new Adapter() });

const route  = { name: "test", path: "/test" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

describe("Links", () => {
  describe("Link", () => {
    it("should render a link with correct path", () => {
      const linkText = "someLinkText";
      const result = (
        <RouterProvider router={router}>
          <Links.Link route={route}>{linkText}</Links.Link>
        </RouterProvider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain(route.path);
    });

    it("should render a link with correct class", () => {
      const linkText = "someLinkText";
      const result = (
        <RouterProvider router={router}>
          <Links.Link route={route}>{linkText}</Links.Link>
        </RouterProvider>
      );
      const wrapper = mount(result);
      const html = wrapper.html();
      expect(html).toContain("govuk-link");
    });

    it("should render a link with correct children", () => {
      const linkText = "someLinkText";
      const result = (
        <RouterProvider router={router}>
          <Links.Link route={route}>{linkText}</Links.Link>
        </RouterProvider>
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
      expect(html).toContain(route.path);
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
