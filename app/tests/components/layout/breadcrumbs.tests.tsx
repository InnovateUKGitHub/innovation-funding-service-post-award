import "jest";
import React from "react";
import { Breadcrumbs } from "../../../src/components/layout/breadcrumbs";
import { createRouter } from "router5";
import { RouterProvider } from "react-router5";
import Enzyme, { mount } from "enzyme";

import browserPluginFactory from "router5/plugins/browser";
import Adapter from "enzyme-adapter-react-16";

const route = { name: "test", path: "/test" } as any;
const router = createRouter([route]).usePlugin(browserPluginFactory({ useHash: false }));

Enzyme.configure({ adapter: new Adapter() });

describe("Breadcrumbs", () => {
    it("should render 3 breadcrumb navigation links and current pages", () => {
        const testID = 5;
        const links = [
            { routeName: "home", text: "Home" },
            { routeName: "contacts", text: "Contacts" },
            { routeName: "contact_details", text: `Contact ${testID}`, routeParams: { id: testID } }
        ];
        const wrapper = mount(
            <RouterProvider router={router}>
                <Breadcrumbs links={links}>Test</Breadcrumbs>
            </RouterProvider>
        );

        expect(wrapper
            .containsMatchingElement(<a className="">Home</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<a className="">Contacts</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<a className="">Contact 5</a>))
            .toBeTruthy();
        expect(wrapper
            .containsMatchingElement(<li className="govuk-breadcrumbs__list-item" aria-current="page">Test</li>))
            .toBeTruthy();
    });
    it("should only render current page breadcrumb navigation", () => {
        const wrapper = mount(
            <RouterProvider router={router}>
                <Breadcrumbs>Test</Breadcrumbs>
            </RouterProvider>
        );
        expect(wrapper
            .containsMatchingElement(<li className="govuk-breadcrumbs__list-item" aria-current="page">Test</li>))
            .toBeTruthy();
    });
});
