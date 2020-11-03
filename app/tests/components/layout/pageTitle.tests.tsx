import React from "react";
import { PageTitle } from "../../../src/ui/components/layout/pageTitle";

import { mount } from "enzyme";

import { IStores, StoresProvider } from "@ui/redux";

describe("PageTitle", () => {
    const stores: IStores = {
        navigation: {
            getPageTitle: () => ({ displayTitle: "a test title", htmlTitle: "" })
        }
    } as IStores;

    it("should render title from stores", () => {

        const result = (
            <StoresProvider value={stores}>
                <PageTitle/>
            </StoresProvider>
        );

        const wrapper = mount(result);
        expect(wrapper
            .containsMatchingElement(<h1 className="govuk-heading-xl clearFix">a test title</h1>))
            .toBeTruthy();
    });

    it("should render caption", () => {
        const result = (
            <StoresProvider value={stores}>
                <PageTitle caption="a test caption" />
            </StoresProvider>
        );

        const wrapper = mount(result);
        expect(wrapper
            .containsMatchingElement(<span className="govuk-caption-xl">a test caption</span>))
            .toBeTruthy();
    });

    it("should not reder caption if prop is not passed in", () => {

        const result = (
            <StoresProvider value={stores}>
                <PageTitle />
            </StoresProvider>
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
