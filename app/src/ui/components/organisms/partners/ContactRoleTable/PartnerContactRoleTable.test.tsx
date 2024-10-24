import { render } from "@testing-library/react";
import { TestBed } from "@shared/TestBed";

import {
  PartnerContactRoleTable,
  PartnersAndFinanceContactsProps,
} from "@ui/components/organisms/partners/ContactRoleTable/PartnerContactRoleTable";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectContactDto, ProjectRoleName } from "@framework/dtos/projectContactDto";
import { getContactRole } from "../utils/getContactRole";

const testPartnerData: PartnerDto[] = [
  {
    id: "123",
    isLead: true,
    projectId: "456" as ProjectId,
    accountId: "321",
    name: "Steel Manufacturing",
  },
  {
    id: "912",
    isLead: false,
    projectId: "456" as ProjectId,
    accountId: "312",
    name: "University of Life",
  },
  {
    id: "431",
    isLead: false,
    projectId: "456" as ProjectId,
    accountId: "832",
    name: "Driverless Cars",
  },
] as PartnerDto[];

const testContactData: Omit<ProjectContactDto, "firstName" | "lastName">[] = [
  {
    id: "100" as ProjectContactLinkId,
    name: "Ted Tester",
    role: ProjectRoleName.FinanceContact,
    roleName: "Finance Contact",
    email: "tedtester@nowhere.com",
    contactId: "908" as ContactId,
    accountId: "321" as AccountId,
    projectId: "456" as ProjectId,
    startDate: null,
    endDate: null,
    associateStartDate: null,
    edited: false,
    replaced: false,
    inactive: false,
    newTeamMember: false,
    sendInvitation: false,
  },
  {
    id: "101" as ProjectContactLinkId,
    name: "Dave Developer",
    role: ProjectRoleName.ProjectManager,
    roleName: "Project Manager",
    email: "davedeveloper@nowhere.com",
    contactId: "908" as ContactId,
    accountId: "312" as AccountId,
    projectId: "456" as ProjectId,
    startDate: null,
    endDate: null,
    associateStartDate: null,
    edited: false,
    replaced: false,
    inactive: false,
    newTeamMember: false,
    sendInvitation: false,
  },
  {
    id: "102" as ProjectContactLinkId,
    name: "Joe Bloggs",
    role: ProjectRoleName.FinanceContact,
    roleName: "Finance Contact",
    email: "joebloggs@nowhere.com",
    contactId: "908" as ContactId,
    accountId: "312" as AccountId,
    projectId: "456" as ProjectId,
    startDate: null,
    endDate: null,
    associateStartDate: null,
    edited: false,
    replaced: false,
    inactive: false,
    newTeamMember: false,
    sendInvitation: false,
  },
  {
    id: "103" as ProjectContactLinkId,
    name: "Bob Baker",
    role: ProjectRoleName.FinanceContact,
    roleName: "Finance Contact",
    email: "bobbaker@nowhere.com",
    contactId: "908" as ContactId,
    accountId: "832" as AccountId,
    projectId: "456" as ProjectId,
    startDate: null,
    endDate: null,
    associateStartDate: null,
    edited: false,
    replaced: false,
    inactive: false,
    newTeamMember: false,
    sendInvitation: false,
  },
];

describe("<PartnersAndFinanceContacts />", () => {
  const setup = (partnerRole: ProjectContactDto["role"]) => {
    const defaultProps: PartnersAndFinanceContactsProps = {
      contactRoles: getContactRole({
        contacts: testContactData,
        partners: testPartnerData,
        partnerRole,
      }),
      caption: "stub-caption",
      qa: "partner-contact-role-table",
    };

    return render(
      <TestBed>
        <PartnerContactRoleTable {...defaultProps} />
      </TestBed>,
    );
  };

  beforeAll(async () => {
    await initStubTestIntl({
      projectContactLabels: {
        contactEmail: "Email",
        contactName: "Name",
        partnerName: "Partner",
      },
    });
  });

  describe("@renders", () => {
    test("matching MO snapshot", () => {
      expect(setup(ProjectRoleName.MonitoringOfficer).container).toMatchSnapshot();
    });

    test("matching FC snapshot", () => {
      expect(setup(ProjectRoleName.FinanceContact).container).toMatchSnapshot();
    });

    test("matching PM snapshot", () => {
      expect(setup(ProjectRoleName.ProjectManager).container).toMatchSnapshot();
    });

    test("with partners names and Steel Manufacturing as the lead", () => {
      const { queryByText } = setup(ProjectRoleName.FinanceContact);

      const partnerNames = [
        queryByText("Steel Manufacturing (Lead)"),
        queryByText("University of Life"),
        queryByText("Driverless Cars"),
      ];

      partnerNames.forEach(partnerName => expect(partnerName).toBeInTheDocument());
    });

    test("with Finance Contacts", () => {
      const { queryByText } = setup(ProjectRoleName.FinanceContact);

      expect(queryByText("Ted Tester")).toBeInTheDocument();
      expect(queryByText("Joe Bloggs")).toBeInTheDocument();
      expect(queryByText("Bob Baker")).toBeInTheDocument();
    });

    test("with emails of all Finance Contact", () => {
      const { queryByText } = setup(ProjectRoleName.FinanceContact);

      expect(queryByText("tedtester@nowhere.com")).toBeInTheDocument();
      expect(queryByText("joebloggs@nowhere.com")).toBeInTheDocument();
      expect(queryByText("bobbaker@nowhere.com")).toBeInTheDocument();
    });

    test("with Project Managers", () => {
      const { queryByText } = setup(ProjectRoleName.ProjectManager);

      expect(queryByText("Dave Developer")).toBeInTheDocument();
    });

    test("with emails of all Project Managers", () => {
      const { queryByText } = setup(ProjectRoleName.ProjectManager);

      expect(queryByText("davedeveloper@nowhere.com")).toBeInTheDocument();
    });
  });
});
