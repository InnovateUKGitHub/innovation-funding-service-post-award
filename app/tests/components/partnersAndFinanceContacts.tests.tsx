// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { PartnersAndFinanceContacts } from "@ui/components/partnersAndFinanceContacts";
import { getColumnValues } from "./helpers/tableHelpers";
import { PartnerDto } from "@framework/types";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { ContentResult } from "@content/contentBase";
import { ContentProvider } from "@ui/redux/contentProvider";
import { StoresProvider } from "@ui/redux";

Enzyme.configure({ adapter: new Adapter() });

const testPartnerData: PartnerDto[] = [
  {
    id: "123",
    type: "Industrial",
    isLead: true,
    projectId: "456",
    accountId: "321",
    name: "Steel Manufacturing",
  },
  {
    id: "912",
    type: "Academic",
    isLead: false,
    projectId: "456",
    accountId: "312",
    name: "University of Life",
  },
  {
    id: "431",
    type: "Industrial",
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

const createContentResult: (content: string) => () => ContentResult = (content) => () => ({ content, key: content, markdown: false });

const labels = () => ({
  contactEmail: createContentResult("Email"),
  contactName: createContentResult("Name"),
  partnerName: createContentResult("Partner"),
  partnerType: createContentResult("Partner type"),
}) as ProjectContactLabels;

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
    const wrapper = mount(<TestProviders><PartnersAndFinanceContacts partners={testPartnerData} contacts={testContactData} projectContactLabels={labels} /></TestProviders>);
    const columnValues = getColumnValues(wrapper, "partner-details", columnQA).map(x => x.text());
    expect(columnValues[0]).toBe(expectedA);
    expect(columnValues[1]).toBe(expectedB);
    expect(columnValues[2]).toBe(expectedC);
  };

  it("should display partner names with Steel Manufacturing as the lead", () => {
    testForCorrectTableEntries("Steel Manufacturing (Lead)", "University of Life", "Driverless Cars", "col-partner-name");
  });

  it("partner type column should display \'Industrial\' followed by \'Academic\'", () => {
    testForCorrectTableEntries("Industrial", "Academic", "Industrial", "col-partner-type");
  });

  it("should display the correct Finance Contact for each project", () => {
    testForCorrectTableEntries("Ted Tester", "Joe Bloggs", "Bob Baker", "col-fc-name");
  });

  it("should display the email for each Finance Contact", () => {
    testForCorrectTableEntries("tedtester@nowhere.com", "joebloggs@nowhere.com", "bobbaker@nowhere.com", "col-fc-email");
  });
});
