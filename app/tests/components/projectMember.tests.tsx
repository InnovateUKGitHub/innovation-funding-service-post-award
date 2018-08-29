import "jest";
import React from "react";
import { ProjectMember } from "../../src/components";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("ProjectMember", () => {
    const aProjectMember = { role: "aTestRole", name: "aTestName", email: "testemail@email.com", organisation: "aTestOrganisation" };
    it("should render organisation if present", () => {
        const wrapper = shallow(<ProjectMember member={aProjectMember} />);
        const expectedRender = <h3 className="govuk-heading-s govuk-!-margin-bottom-0">aTestRole - aTestOrganisation</h3>;
        expect(wrapper.equals(expectedRender));
    });

    it("should only render role if organisation is not present", () => {
        const wrapper = shallow(<ProjectMember member={aProjectMember} />);
        const expectedRender = <h3 className="govuk-heading-s govuk-!-margin-bottom-0">aTestRole</h3>;
        expect(wrapper.equals(expectedRender));
    });

    it("should return null if aProjectMember is null", () => {
        const result = ProjectMember({ member: null });
        expect(result).toBeNull();
    });

    it("should return null if aProjectMember is undefined", () => {
        const result = ProjectMember({ member: undefined });
        expect(result).toBeNull();
    });

    it("should render member\'s name ", () => {
        const wrapper = shallow(<ProjectMember member={aProjectMember} />);
        const expectedRender = <p className="govuk-body govuk-!-margin-bottom-0">aTestName</p>;
        expect(wrapper.equals(expectedRender));
    });

    it("should render member\'s email ", () => {
        const wrapper = mount(<ProjectMember member={aProjectMember} />);
        const html = wrapper.html();
        expect(html).toContain("testemail@email.com");
        expect(wrapper
            .containsMatchingElement(
                <a href="mailto:testemail@email.com" className="govuk-link govuk-!-font-size-19">
                    testemail@email.com
                </a>
            )).toBeTruthy();
    });
});
