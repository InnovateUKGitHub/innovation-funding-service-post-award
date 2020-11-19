// tslint:disable:no-duplicate-string
import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import { PartnersAndFinanceContacts } from "@ui/components/partnersAndFinanceContacts";
import { getColumnValues } from "./helpers/tableHelpers";
import { PartnerDto, ProjectContactDto } from "@framework/types";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { ContentResult } from "@content/contentBase";
import { ContentProvider } from "@ui/redux/contentProvider";
import { StoresProvider } from "@ui/redux";
import { Content } from "@content/content";

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
  }
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
    projectId: "456"
  },
  {
    id: "102",
    name: "Joe Bloggs",
    role: "Finance contact",
    roleName: "Finance Contact",
    email: "joebloggs@nowhere.com",
    accountId: "312",
    projectId: "456"
  },
  {
    id: "103",
    name: "Bob Baker",
    role: "Finance contact",
    roleName: "Finance Contact",
    email: "bobbaker@nowhere.com",
    accountId: "832",
    projectId: "456",
  }
];

const labels = {
  contactEmail: {
    content: "Email"
  },
  contactName: {
    content: "Name"
  },
  partnerName: {
    content: "Partner"
  },
} as ProjectContactLabels;

const testStores = {
  config : {
    getConfig: () => ({
      features: ({

      })
    })
  }
};

const TestProviders: React.FunctionComponent = (props) => <StoresProvider value={testStores as any}><ContentProvider value={{} as any}>{props.children}</ContentProvider></StoresProvider>;

describe("Partners Table", () => {
  const testForCorrectTableEntries = (expectedA: string, expectedB: string, expectedC: string, columnQA: string) => {
    const wrapper = mount(<TestProviders><PartnersAndFinanceContacts partners={testPartnerData} contacts={testContactData} projectContactLabels={() => labels} /></TestProviders>);
    const columnValues = getColumnValues(wrapper, "finance-contact-details", columnQA).map(x => x.text());
    expect(columnValues[0]).toBe(expectedA);
    expect(columnValues[1]).toBe(expectedB);
    expect(columnValues[2]).toBe(expectedC);
  };

  it("should display partner names with Steel Manufacturing as the lead", () => {
    testForCorrectTableEntries("Steel Manufacturing (Lead)", "University of Life", "Driverless Cars", "col-partner-name");
  });

  it("should display the correct Finance Contact for each project", () => {
    testForCorrectTableEntries("Ted Tester", "Joe Bloggs", "Bob Baker", "col-fc-name");
  });

  it("should display the email for each Finance Contact", () => {
    testForCorrectTableEntries("tedtester@nowhere.com", "joebloggs@nowhere.com", "bobbaker@nowhere.com", "col-fc-email");
  });
});
