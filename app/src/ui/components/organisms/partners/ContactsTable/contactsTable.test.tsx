import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";
import { ContactsTable, IContactsTable } from "@ui/components/organisms/partners/ContactsTable/contactsTable";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { ProjectContactDto, ProjectRoleName } from "@framework/dtos/projectContactDto";
import { getColumnValues } from "@tests/test-utils/tableHelpers";

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
          id: "100" as ProjectContactLinkId,
          name: "Ted Tester",
          role: ProjectRoleName.FinanceContact,
          roleName: "Finance Contact",
          email: "tedtester@nowhere.com",
          contactId: "892" as ContactId,
          accountId: "321" as AccountId,
          projectId: "456" as ProjectId,
          startDate: null,
          endDate: null,
          associateStartDate: null,
          firstName: "Ted",
          lastName: "Tester",
        },
        {
          id: "101" as ProjectContactLinkId,
          name: "Dave Developer",
          role: ProjectRoleName.ProjectManager,
          roleName: "Project Manager",
          email: "davedeveloper@nowhere.com",
          contactId: "892" as ContactId,
          accountId: "312" as AccountId,
          projectId: "456" as ProjectId,
          startDate: null,
          endDate: null,
          associateStartDate: null,
          firstName: "Dave",
          lastName: "Developer",
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
          id: "100" as ProjectContactLinkId,
          name: "Ted Tester",
          role: ProjectRoleName.FinanceContact,
          roleName: "Finance Contact",
          email: "tedtester@nowhere.com",
          contactId: "892" as ContactId,
          accountId: "321" as AccountId,
          projectId: "456" as ProjectId,
          startDate: null,
          endDate: null,
          associateStartDate: null,
          firstName: "Ted",
          lastName: "Tester",
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
          id: "100" as ProjectContactLinkId,
          name: "Ted Tester",
          role: ProjectRoleName.FinanceContact,
          roleName: "Finance Contact",
          email: "tedtester@nowhere.com",
          contactId: "892" as ContactId,
          accountId: "321" as AccountId,
          projectId: "456" as ProjectId,
          startDate: null,
          endDate: null,
          associateStartDate: null,
          firstName: "Ted",
          lastName: "Tester",
        },
        {
          id: "101" as ProjectContactLinkId,
          name: "Dave Developer",
          role: ProjectRoleName.ProjectManager,
          roleName: "Project Manager",
          email: "davedeveloper@nowhere.com",
          contactId: "892" as ContactId,
          accountId: "312" as AccountId,
          projectId: "456" as ProjectId,
          startDate: null,
          endDate: null,
          associateStartDate: null,
          firstName: "Dave",
          lastName: "Developer",
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
