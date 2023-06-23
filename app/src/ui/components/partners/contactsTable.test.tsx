import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { ContactsTable, IContactsTable } from "@ui/components/partners/contactsTable";
import { getColumnValues } from "../../../../tests/test-utils/tableHelpers";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";

describe("<ContactsTable />", () => {
  const stubContent = {
    projectContactLabels: {
      contactName: "Contact",
      roleName: "Name",
      contactEmail: "Partner",
      noContactsMessage: "No contacts exist.",
    },
  };

  const setup = (props?: Omit<IContactsTable, "projectContactLabels">) => {
    const defaultProps: IContactsTable = {
      contacts: [],
    };

    return render(
      <TestBed>
        <ContactsTable {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  beforeAll(async () => {
    initStubTestIntl(stubContent);
  });

  describe("@returns", () => {
    it("when no contacts message", () => {
      const { queryByText } = setup();

      const noContactsElement = queryByText(stubContent.projectContactLabels.noContactsMessage);

      expect(noContactsElement).toBeInTheDocument();
    });

    it("when contacts are provided", () => {
      const stubContacts: ProjectContactDto[] = [
        {
          id: "100",
          name: "Ted Tester",
          role: "Finance contact",
          roleName: "Finance Contact",
          email: "tedtester@nowhere.com",
          accountId: "321",
          projectId: "456" as ProjectId,
        },
        {
          id: "101",
          name: "Dave Developer",
          role: "Project Manager",
          roleName: "Project Manager",
          email: "davedeveloper@nowhere.com",
          accountId: "312",
          projectId: "456" as ProjectId,
        },
      ];

      const { queryByText, queryByTestId } = setup({ contacts: stubContacts });

      const noContactsElement = queryByText(stubContent.projectContactLabels.noContactsMessage);
      const contactsTable = queryByTestId("contacts-table-details");

      expect(contactsTable).toBeInTheDocument();
      expect(noContactsElement).not.toBeInTheDocument();
    });

    it("with valid form data", () => {
      const stubContacts: ProjectContactDto[] = [
        {
          id: "100",
          name: "Ted Tester",
          role: "Finance contact",
          roleName: "Finance Contact",
          email: "tedtester@nowhere.com",
          accountId: "321",
          projectId: "456" as ProjectId,
        },
      ];

      const { queryByText } = setup({ contacts: stubContacts });

      for (const contact of stubContacts) {
        expect(queryByText(contact.name)).toBeInTheDocument();
        expect(queryByText(contact.roleName)).toBeInTheDocument();
        expect(queryByText(contact.email)).toBeInTheDocument();
      }
    });

    it("with correct table layout", () => {
      const stubContacts: ProjectContactDto[] = [
        {
          id: "100",
          name: "Ted Tester",
          role: "Finance contact",
          roleName: "Finance Contact",
          email: "tedtester@nowhere.com",
          accountId: "321",
          projectId: "456" as ProjectId,
        },
        {
          id: "101",
          name: "Dave Developer",
          role: "Project Manager",
          roleName: "Project Manager",
          email: "davedeveloper@nowhere.com",
          accountId: "312",
          projectId: "456" as ProjectId,
        },
      ];

      const { container } = setup({ contacts: stubContacts });

      const getValueByColumnName = (columnName: string) =>
        getColumnValues(container, "contacts-table-details", columnName).map(x => x.innerHTML);

      const column1PartnerName = getValueByColumnName("col-partner-name");
      const column2PartnerRoleName = getValueByColumnName("col-partner-roleName");
      const column3Email = getValueByColumnName("col-partner-email");

      // Note: Loop every stub item and check column matches record
      for (let index = 0; index < stubContacts.length; index++) {
        const stubContact = stubContacts[index];

        expect(column1PartnerName[index]).toBe(stubContact.name);
        expect(column2PartnerRoleName[index]).toBe(stubContact.roleName);
        expect(column3Email[index]).toContain(stubContact.email);
      }
    });
  });
});
