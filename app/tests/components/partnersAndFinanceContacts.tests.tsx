import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { PartnersAndFinanceContacts } from "../../src/ui/components";
import { getColumnValues } from "./helpers/tableHelpers";
import * as Dtos from "../../src/ui/models";

Enzyme.configure({ adapter: new Adapter() });

const testPartnerData: Dtos.PartnerDto[] = [
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
];

const testContactData: Dtos.ProjectContactDto[] = [
  {
    id: "100",
    name: "Ted Tester",
    role: "Finance contact",
    email: "tedtester@nowhere.com",
    accountId: "321",
    projectId: "456",
  },
  {
    id: "101",
    name: "Dave Developer",
    role: "Project manager",
    email: "davedeveloper@nowhere.com",
    accountId: "312",
    projectId: "456"
  },
  {
    id: "102",
    name: "Joe Bloggs",
    role: "Finance contact",
    email: "joebloggs@nowhere.com",
    accountId: "312",
    projectId: "456"
  },
  {
    id: "103",
    name: "Bob Baker",
    role: "Finance contact",
    email: "bobbaker@nowhere.com",
    accountId: "832",
    projectId: "456",
  }
];

describe("Partners Table", () => {
  const testForCorrectTableEntries = (expectedA: string, expectedB: string, expectedC: string, columnQA: string) => {
    const wrapper = mount(<PartnersAndFinanceContacts partners={testPartnerData} contacts={testContactData} />);
    const columnValues = getColumnValues(wrapper, "project-details-table", columnQA).map(x => x.text());
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

  it("should display the correct finance contact for each project", () => {
    testForCorrectTableEntries("Ted Tester", "Joe Bloggs", "Bob Baker", "col-fc-name");
  });

  it("should display the email for each finance contact", () => {
    testForCorrectTableEntries("tedtester@nowhere.com", "joebloggs@nowhere.com", "bobbaker@nowhere.com", "col-fc-email");
  });
});
