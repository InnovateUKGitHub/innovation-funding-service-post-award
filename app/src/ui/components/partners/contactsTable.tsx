import React from "react";
import { TypedTable } from "../table";
import { Content as IContent } from "@content/content";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { SimpleString } from "../renderers";
import { Content } from "../content";

export interface IContactsTable {
  contacts: ProjectContactDto[];
  projectContactLabels: (content: IContent) => ProjectContactLabels;
}

export const ContactsTable: React.FunctionComponent<IContactsTable> = ({
  contacts,
  projectContactLabels,
}) => {
  const ContactsUI = TypedTable<ProjectContactDto>();

  return contacts.length ? (
    <ContactsUI.Table qa="contacts-table-details" data={contacts}>
      <ContactsUI.String headerContent={x => projectContactLabels(x).contactName()} value={x => x.name} qa="partner-name" />
      <ContactsUI.String headerContent={x => projectContactLabels(x).roleName()} value={x => x.roleName} qa="partner-roleName" />
      <ContactsUI.Email headerContent={x => projectContactLabels(x).contactEmail()} value={x => x.email} qa="partner-email" />
    </ContactsUI.Table>
  ) : (
    <SimpleString className="govuk-!-margin-bottom-0" qa="no-contacts-exist">
      <Content value={x => projectContactLabels(x).noContactsMessage()} />
    </SimpleString>
  );
};

ContactsTable.displayName = "ContactsTable";
