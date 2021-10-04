import { Content as IContent } from "@content/content";
import { ProjectContactLabels } from "@content/labels/projectContactLabels";
import { ProjectContactDto } from "@framework/dtos";
import { TypedTable } from "../table";
import { SimpleString } from "../renderers";
import { Content } from "../content";

export interface IContactsTable {
  contacts: ProjectContactDto[];
  projectContactLabels: (content: IContent) => ProjectContactLabels;
}

export function ContactsTable({ contacts, projectContactLabels }: IContactsTable) {
  if (!contacts.length) {
    return (
      <SimpleString className="govuk-!-margin-bottom-0" qa="no-contacts-exist">
        <Content value={x => projectContactLabels(x).noContactsMessage} />
      </SimpleString>
    );
  }

  const ContactsUI = TypedTable<ProjectContactDto>();

  return (
    <ContactsUI.Table qa="contacts-table-details" data={contacts}>
      <ContactsUI.String
        qa="partner-name"
        header={x => projectContactLabels(x).contactName}
        value={x => x.name}
      />

      <ContactsUI.String
        qa="partner-roleName"
        header={x => projectContactLabels(x).roleName}
        value={x => x.roleName}
      />

      <ContactsUI.Email
        qa="partner-email"
        header={x => projectContactLabels(x).contactEmail}
        value={x => x.email}
      />
    </ContactsUI.Table>
  );
}
