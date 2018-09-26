import "jest";
import React from "react";
import { ProjectMember } from "../../src/ui/components/projectMember";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("ProjectMember", () => {
    const aProjectMemberWithOrg = { role: "aTestRole", name: "aTestName", email: "testemail@email.com", organisation: "aTestOrganisation" };
    const aProjectMemberWithoutOrg = { role: "aTestRole", name: "aTestName", email: "testemail@email.com", organisation: null };
    
    it("should render organisation if present", () => {
        const wrapper = shallow(<ProjectMember member={aProjectMemberWithOrg} qa="member-a" />);
        expect(wrapper.html()).toContain(`<h3 class=\"govuk-heading-s govuk-!-margin-bottom-0\">aTestRole - aTestOrganisation</h3>`);
    });

    it("should only render role if organisation is not present", () => {
        const wrapper = shallow(<ProjectMember member={aProjectMemberWithoutOrg} qa="member-a"/>);
        expect(wrapper.html()).toContain(`<h3 class="govuk-heading-s govuk-!-margin-bottom-0">aTestRole</h3>`);
    });

    it("should return null if aProjectMember is null", () => {
        const result = shallow(<ProjectMember member={null} qa="member-a"/>);
        expect(result.html()).toBeNull();
    });

    it("should return null if aProjectMember is undefined", () => {
        const result = shallow(<ProjectMember member={undefined} qa="member-a"/>);
        expect(result.html()).toBeNull();
    });

    it("should render member\'s name ", () => {
        const wrapper = shallow(<ProjectMember member={aProjectMemberWithOrg} qa="member-a"/>);
        expect(wrapper.html()).toContain(`<p class=\"govuk-body govuk-!-margin-bottom-0\" data-qa=\"member-a-name\">aTestName</p>`);
    });

    it("should render member\'s email ", () => {
        const wrapper = mount(<ProjectMember member={aProjectMemberWithOrg} qa="member-a"/>);
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
