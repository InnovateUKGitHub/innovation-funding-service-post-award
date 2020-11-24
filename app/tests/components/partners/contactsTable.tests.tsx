import React from "react";
import { mount } from "enzyme";

import { getColumnValues } from "../helpers/tableHelpers";
import { findByQa } from "../helpers/find-by-qa";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { ContentProvider } from "@ui/redux/contentProvider";
import { StoresProvider } from "@ui/redux";
import {
  ContactsTable,
  IContactsTable,
} from "@ui/components/partners/contactsTable";
import { ProjectContactDto } from "@framework/dtos";

const TestProviders: React.FunctionComponent = (props) => {
  const testStores = {
    config: {
      getConfig: () => ({
        features: {},
      }),
    },
  };

  return (
    <StoresProvider value={testStores as any}>
      <ContentProvider value={{} as any}>{props.children}</ContentProvider>
    </StoresProvider>
  );
};

describe("Contacts Table", () => {
  const testContacts: ProjectContactDto[] = [
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
  ];

  const setupTest = (contacts: IContactsTable["contacts"]) => {

    const testLabels = {
      contactName: {
        content: "Contact"
      },
      roleName: {
        content: "Name"
      },
      contactEmail: {
        content: "Partner"
      },
      noContactsMessage: {
        content: "No contacts exist."
      },
    } as ProjectContactLabels;

    const wrapper = mount(
      <TestProviders>
        <ContactsTable
          contacts={contacts}
          projectContactLabels={() => testLabels}
        />
      </TestProviders>
    );

    const getValueByColumnName = (columnName: string) =>
      getColumnValues(wrapper, "contacts-table-details", columnName).map((x) =>
        x.text()
      );

    return {
      wrapper,
      getValueByColumnName,
    };
  };

  it("should return message when no contacts provided", () => {
    const { wrapper } = setupTest([]);

    const emptyContactElement = findByQa(wrapper, "no-contacts-exist");
    const emptyTextMessage = emptyContactElement.text();

    expect(emptyContactElement).toBeDefined();
    expect(emptyTextMessage).toBe("No contacts exist.");
  });

  it("should return form data when contacts provided", () => {
    const { wrapper } = setupTest(testContacts);
    const contactTableElement = findByQa(wrapper, "contacts-table-details");

    expect(contactTableElement).toBeDefined();
  });

  it("should return valid form data", () => {
    const { getValueByColumnName } = setupTest(testContacts);

    const col1 = getValueByColumnName("col-partner-name");
    const col2 = getValueByColumnName("col-partner-roleName");
    const col3 = getValueByColumnName("col-partner-email");

    expect(col1[0]).toBe(testContacts[0].name);
    expect(col1[1]).toBe(testContacts[1].name);

    expect(col2[0]).toBe(testContacts[0].roleName);
    expect(col2[1]).toBe(testContacts[1].roleName);

    expect(col3[0]).toBe(testContacts[0].email);
    expect(col3[1]).toBe(testContacts[1].email);
  });
});
