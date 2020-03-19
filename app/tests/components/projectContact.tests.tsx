// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import { ProjectContact } from "../../src/ui/components/projectContact";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";
import { PartnerDto } from "@framework/dtos";
import { createDto } from "@framework/util";

Enzyme.configure({ adapter: new Adapter() });

describe("ProjectMember", () => {
    const aProjectContact = createDto<ProjectContactDto>({ role: "Project Manager", name: "aTestName", email: "testemail@email.com", roleName: "aTestRole" });
    const aPartner = createDto<PartnerDto>({ name: "aTestOrganisation"});

    it("should render partner name if present", () => {
        const wrapper = shallow(<ProjectContact contact={aProjectContact} partner={aPartner} qa="member-a" />);
        expect(wrapper.html()).toContain(`aTestOrganisation`);
    });

    it("should render role name if present", () => {
        const wrapper = shallow(<ProjectContact contact={aProjectContact} qa="member-a" />);
        expect(wrapper.html()).toContain("aTestRole");
    });

    it("should return null if aProjectContact is null", () => {
        const result = shallow(<ProjectContact contact={null} qa="member-a" />);
        expect(result.html()).toBeNull();
    });

    it("should return null if aProjectContact is undefined", () => {
        const result = shallow(<ProjectContact contact={undefined} qa="member-a" />);
        expect(result.html()).toBeNull();
    });

    it("should render member\'s name ", () => {
        const wrapper = shallow(<ProjectContact contact={aProjectContact} qa="member-a" />);
        expect(wrapper.html()).toContain(`aTestName`);
    });

    it("should render member\'s email ", () => {
        const wrapper = mount(<ProjectContact contact={aProjectContact} qa="member-a" />);
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
