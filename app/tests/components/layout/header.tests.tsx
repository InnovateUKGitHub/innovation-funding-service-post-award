// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import { Header } from "@ui/components/layout/header";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Header", () => {
    const ifsRoot = "https://example.apply-for-innovation-funding.service.gov.uk";

    it("header shoud contain Innovation Funding Service link", () => {
        const result = <Header ifsRoot={ifsRoot} />;
        const wrapper = shallow(result);
        const link = wrapper.find("a[data-qa='service-name']");
        expect(link).not.toBeNull();
        expect(link.text()).toBe("Innovation Funding Service");
        expect(link.hasClass("govuk-header__link govuk-header__link--service-name")).toBe(true);
        expect(link.get(0).props.href).toBe(`${ifsRoot}/competition/search`);
    });

    it("header shoud contain dashboard link", () => {
        const result = <Header ifsRoot={ifsRoot} />;
        const wrapper = shallow(result);
        const link = wrapper.find("a[data-qa='nav-dashboard']");
        expect(link).not.toBeNull();
        expect(link.text()).toBe("Dashboard");
        expect(link.hasClass("govuk-header__link")).toBe(true);
        expect(link.get(0).props.href).toBe(`${ifsRoot}/dashboard-selection`);
    });

    it("header shoud contain profile link", () => {
        const result = <Header ifsRoot={ifsRoot} />;
        const wrapper = shallow(result);
        const link = wrapper.find("a[data-qa='nav-profile']");
        expect(link).not.toBeNull();
        expect(link.text()).toBe("Profile");
        expect(link.hasClass("govuk-header__link")).toBe(true);
        expect(link.get(0).props.href).toBe(`${ifsRoot}/profile/view`);
    });

    it("header shoud contain logout link", () => {
        const result = <Header ifsRoot={ifsRoot} />;
        const wrapper = shallow(result);
        const link = wrapper.find("a[data-qa='nav-sign-out']");
        expect(link).not.toBeNull();
        expect(link.text()).toBe("Sign out");
        expect(link.hasClass("govuk-header__link")).toBe(true);
        expect(link.get(0).props.href).toBe(`/logout`);
    });
});
