import { render } from "@testing-library/react";

import { TestBed, TestBedStore } from "@shared/TestBed";
import { PartnerDto, ProjectContactDto } from "@framework/types";
import { PartnersAndFinanceContacts, PartnersAndFinanceContactsProps } from "@ui/components/partnersAndFinanceContacts";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";

const testPartnerData: PartnerDto[] = [
  {
    id: "123",
    isLead: true,
    projectId: "456",
    accountId: "321",
    name: "Steel Manufacturing",
  },
  {
    id: "912",
    isLead: false,
    projectId: "456",
    accountId: "312",
    name: "University of Life",
  },
  {
    id: "431",
    isLead: false,
    projectId: "456",
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
    projectId: "456",
  },
  {
    id: "101",
    name: "Dave Developer",
    role: "Project Manager",
    roleName: "Project Manager",
    email: "davedeveloper@nowhere.com",
    accountId: "312",
    projectId: "456",
  },
  {
    id: "102",
    name: "Joe Bloggs",
    role: "Finance contact",
    roleName: "Finance Contact",
    email: "joebloggs@nowhere.com",
    accountId: "312",
    projectId: "456",
  },
  {
    id: "103",
    name: "Bob Baker",
    role: "Finance contact",
    roleName: "Finance Contact",
    email: "bobbaker@nowhere.com",
    accountId: "832",
    projectId: "456",
  },
];

describe("<PartnersAndFinanceContacts />", () => {
  const setup = () => {
    const testStores = {
      config: {
        getConfig: () => ({
          features: {},
        }),
      },
    };

    const stubLabels = {
      contactEmail: { content: "Email" },
      contactName: { content: "Name" },
      partnerName: { content: "Partner" },
    } as ProjectContactLabels;

    const defaultProps: PartnersAndFinanceContactsProps = {
      partners: testPartnerData,
      contacts: testContactData,
      projectContactLabels: () => stubLabels,
    };

    return render(
      <TestBed stores={testStores as TestBedStore}>
        <PartnersAndFinanceContacts {...defaultProps} />
      </TestBed>,
    );
  };

  describe("@renders", () => {
    test("with partners names and Steel Manufacturing as the lead", () => {
      const { queryByText } = setup();

      const partnerNames = [
        queryByText("Steel Manufacturing (Lead)"),
        queryByText("University of Life"),
        queryByText("Driverless Cars"),
      ];

      partnerNames.forEach(partnerName => expect(partnerName).toBeInTheDocument());
    });

    test("with Finance Contacts", () => {
      const { queryByText } = setup();

      const financeContacts = [queryByText("Ted Tester"), queryByText("Joe Bloggs"), queryByText("Bob Baker")];

      financeContacts.forEach(fcContact => expect(fcContact).toBeInTheDocument());
    });

    test("with emails of all Finance Contact", () => {
      const { queryByText } = setup();

      const fcContactEmails = [
        queryByText("tedtester@nowhere.com"),
        queryByText("joebloggs@nowhere.com"),
        queryByText("bobbaker@nowhere.com"),
      ];

      fcContactEmails.forEach(partnerName => expect(partnerName).toBeInTheDocument());
    });
  });
});
