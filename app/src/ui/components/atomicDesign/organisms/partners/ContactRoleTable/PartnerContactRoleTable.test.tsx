import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";

import {
  PartnerContactRoleTable,
  PartnersAndFinanceContactsProps,
} from "@ui/components/atomicDesign/organisms/partners/ContactRoleTable/PartnerContactRoleTable";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
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

const testContactData: ProjectContactDto[] = [
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
  {
    id: "102",
    name: "Joe Bloggs",
    role: "Finance contact",
    roleName: "Finance Contact",
    email: "joebloggs@nowhere.com",
    accountId: "312",
    projectId: "456" as ProjectId,
  },
  {
    id: "103",
    name: "Bob Baker",
    role: "Finance contact",
    roleName: "Finance Contact",
    email: "bobbaker@nowhere.com",
    accountId: "832",
    projectId: "456" as ProjectId,
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
      expect(setup("Monitoring officer").container).toMatchSnapshot();
    });

    test("matching FC snapshot", () => {
      expect(setup("Finance contact").container).toMatchSnapshot();
    });

    test("matching PM snapshot", () => {
      expect(setup("Project Manager").container).toMatchSnapshot();
    });

    test("with partners names and Steel Manufacturing as the lead", () => {
      const { queryByText } = setup("Finance contact");

      const partnerNames = [
        queryByText("Steel Manufacturing (Lead)"),
        queryByText("University of Life"),
        queryByText("Driverless Cars"),
      ];

      partnerNames.forEach(partnerName => expect(partnerName).toBeInTheDocument());
    });

    test("with Finance Contacts", () => {
      const { queryByText } = setup("Finance contact");

      expect(queryByText("Ted Tester")).toBeInTheDocument();
      expect(queryByText("Joe Bloggs")).toBeInTheDocument();
      expect(queryByText("Bob Baker")).toBeInTheDocument();
    });

    test("with emails of all Finance Contact", () => {
      const { queryByText } = setup("Finance contact");

      expect(queryByText("tedtester@nowhere.com")).toBeInTheDocument();
      expect(queryByText("joebloggs@nowhere.com")).toBeInTheDocument();
      expect(queryByText("bobbaker@nowhere.com")).toBeInTheDocument();
    });

    test("with Project Managers", () => {
      const { queryByText } = setup("Project Manager");

      expect(queryByText("Dave Developer")).toBeInTheDocument();
    });

    test("with emails of all Project Managers", () => {
      const { queryByText } = setup("Project Manager");

      expect(queryByText("davedeveloper@nowhere.com")).toBeInTheDocument();
    });
  });
});
