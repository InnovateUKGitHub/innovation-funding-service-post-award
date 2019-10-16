import "jest";
import React from "react";
import { Title } from "../../../src/ui/components/layout/title";

import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { IStores, StoresProvider } from "@ui/redux";

Enzyme.configure({ adapter: new Adapter() });

describe("Title", () => {
    const stores: IStores = {
        navigation: {
            getPageTitle: () => ({ displayTitle: "a test title", htmlTitle: "" })
        }
    } as IStores;

    it("should render title from stores", () => {

        const result = (
            <StoresProvider value={stores}>
                <Title/>
            </StoresProvider>
        );

        const wrapper = mount(result);
        expect(wrapper
            .containsMatchingElement(<h1 className="govuk-heading-xl clearFix">a test title</h1>))
            .toBeTruthy();
    });

    it("should render title from props", () => {

        const result = (
            <StoresProvider value={stores}>
                <Title title="The custom title"/>
            </StoresProvider>
        );

        const wrapper = mount(result);
        expect(wrapper
            .containsMatchingElement(<h1 className="govuk-heading-xl clearFix">The custom title</h1>))
            .toBeTruthy();
    });

    it("should render caption", () => {
        const result = (
            <StoresProvider value={stores}>
                <Title caption="a test caption" />
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
                <Title />
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
