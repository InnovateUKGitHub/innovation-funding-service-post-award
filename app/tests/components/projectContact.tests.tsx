import { render } from "@testing-library/react";

import { PartnerDto, ProjectContactDto } from "@framework/dtos";
import { createDto } from "@framework/util";
import { ProjectContact, ProjectContactProps } from "@ui/components/projectContact";

describe("ProjectMember", () => {
  const stubPartner = createDto<PartnerDto>({ name: "aTestOrganisation" });
  const stubContact = createDto<ProjectContactDto>({
    role: "Project Manager",
    name: "aTestName",
    email: "testemail@email.com",
    roleName: "aTestRole",
  });

  const setup = (props?: Partial<ProjectContactProps>) => render(<ProjectContact {...props} qa="member-a" />);

  describe("@returns", () => {
    it("with partner name if present", () => {
      const { queryByText } = setup({
        contact: stubContact,
        partner: stubPartner,
      });

      const partnerName = queryByText(stubPartner.name);

      expect(partnerName).toBeInTheDocument();
    });

    it("with role name if present", () => {
      const { queryByText } = setup({
        contact: stubContact,
        partner: stubPartner,
      });

      const roleName = queryByText(stubContact.roleName);

      expect(roleName).toBeInTheDocument();
    });

    it("when ProjectContact has no contact set", () => {
      const { container } = setup();

      expect(container.firstChild).toBeNull();
    });

    it("with member's name ", () => {
      const { queryByText } = setup({
        contact: stubContact,
        partner: stubPartner,
      });

      const contactName = queryByText(stubContact.name);

      expect(contactName).toBeInTheDocument();
    });

    it("with member's email ", () => {
      const { queryByText } = setup({ contact: stubContact });

      const contactEmail = queryByText(stubContact.email);

      expect(contactEmail).toBeInTheDocument();
    });
  });
});
