import { Caption, createTypedTable } from "@ui/components/molecules/Table/Table";
import { Content } from "../../../molecules/Content/content";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { SimpleString } from "../../../atoms/SimpleString/simpleString";

type Contacts = Pick<ProjectContactDto, "name" | "roleName" | "email">;
export interface IContactsTable {
  contacts: Contacts[];
  caption: Caption;
}

const ContactsUI = createTypedTable<Contacts>();

/**
 * ContactsTable component
 */
export function ContactsTable({ contacts, caption }: IContactsTable) {
  if (!contacts.length) {
    return (
      <SimpleString className="govuk-!-margin-bottom-0" qa="no-contacts-exist">
        <Content value={x => x.projectContactLabels.noContactsMessage} />
      </SimpleString>
    );
  }

  return (
    <ContactsUI.Table qa="contacts-table-details" data={contacts} caption={caption}>
      <ContactsUI.String qa="partner-name" header={x => x.projectContactLabels.contactName} value={x => x.name} />

      <ContactsUI.String qa="partner-roleName" header={x => x.projectContactLabels.roleName} value={x => x.roleName} />

      <ContactsUI.Email qa="partner-email" header={x => x.projectContactLabels.contactEmail} value={x => x.email} />
    </ContactsUI.Table>
  );
}
