// tslint:disable:no-duplicate-string
import React from "react";
import { ProjectContact } from "../../src/ui/components/projectContact";

// tslint:disable-next-line: import-blacklist
import { mount, shallow } from "enzyme";
import { PartnerDto, ProjectContactDto } from "@framework/dtos";
import { createDto } from "@framework/util";

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

    it("should return null when ProjectContact has no contact set", () => {
        const result = shallow(<ProjectContact qa="member-a" />);
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
