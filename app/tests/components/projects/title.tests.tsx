import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Title } from "../../../src/ui/components/projects";
import createRouter from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import { createStore } from "redux";
import { rootReducer } from "@framework/ui/redux";

Enzyme.configure({ adapter: new Adapter() });

describe("Title", () => {
  const route = { routeName: "test", routeParams: { id: "exampleId" }, accessControl: () => true };
  const router = createRouter([{ name: route.routeName, path: "/test/:id" }]).usePlugin(browserPluginFactory({ useHash: false }));

  it("should render with the correct title", () => {
    const result = (
      <Provider store={createStore(rootReducer)}>
        <RouterProvider router={router}>
          <Title project={{ projectNumber: "3", title: "project title" } as any} />
        </RouterProvider>
      </Provider>
    );
    const wrapper = mount(result);

    expect(wrapper.text()).toContain("3 : project title");
  });
});
