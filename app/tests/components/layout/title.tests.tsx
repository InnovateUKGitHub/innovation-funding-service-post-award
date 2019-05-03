import "jest";
import React from "react";
import { Title } from "../../../src/ui/components/layout/title";

import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { RouterProvider } from "react-router5";
import { rootReducer, RootState } from "../../../src/ui/redux/reducers";
import { createRouter } from "router5";
import browserPluginFactory from "router5/plugins/browser";

Enzyme.configure({ adapter: new Adapter() });

describe("Title", () => {
    const aCaption = "a test caption";
    const aTitle = "a test title";
    const route = { routeName: "test", routeParams: { id: "exampleId" }, accessControl: () => true };
    const router = createRouter([{ name: route.routeName, path: "/test/:id" }]).usePlugin(browserPluginFactory({ useHash: false }));
    const store = createStore(rootReducer, { title: { displayTitle: aTitle } });

    it("should render caption", () => {

        const result = (
            <Provider store={store}>
                <RouterProvider router={router}>
                    <Title caption={aCaption}/>
                </RouterProvider>
            </Provider>
        );

        const wrapper = mount(result);
        expect(wrapper
            .containsMatchingElement(<h1 className="govuk-heading-xl clearFix">a test title</h1>))
            .toBeTruthy();
    });

    it("should render title", () => {
        const result = (
            <Provider store={store}>
                <RouterProvider router={router}>
                    <Title caption={aCaption}/>
                </RouterProvider>
            </Provider>
        );

        const wrapper = mount(result);
        expect(wrapper
            .containsMatchingElement(<span className="govuk-caption-xl">a test caption</span>))
            .toBeTruthy();
    });

    it("should not reder caption if prop is not passed in", () => {

        const result = (
            <Provider store={store}>
                <RouterProvider router={router}>
                    <Title/>
                </RouterProvider>
            </Provider>
        );

        const wrapper = mount(result);
        expect(wrapper
            .containsMatchingElement(<h1 className="govuk-heading-xl clearFix">a test title</h1>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<span className="govuk-caption-xl">a test caption</span>))
            .toBeFalsy();
    });
});
