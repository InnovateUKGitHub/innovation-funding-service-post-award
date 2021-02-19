import { PartnerDto, ProjectContactDto } from "@framework/dtos";
import { PartnerName } from "@ui/components/partners";
import { Section } from "@ui/components/layout";
import { SimpleString } from "@ui/components/renderers";
import { Email } from "./renderers/email";

interface IProjectContact {
  contact?: ProjectContactDto;
  partner?: PartnerDto;
  qa: string;
}

export const ProjectContact: React.FunctionComponent<IProjectContact> = ({
  contact,
  partner,
  qa,
}) => {
  if (!contact) return null;

  return (
    <Section title={contact.roleName}>
      <SimpleString className="govuk-!-margin-bottom-0" qa={`${qa}-roleName`}>
        {contact.name}
      </SimpleString>

      {partner && (
        <SimpleString className="govuk-!-margin-bottom-0" qa={`${qa}-name`}>
          <PartnerName partner={partner} />
        </SimpleString>
      )}

      <Email qa={`${qa}-email`}>{contact.email}</Email>
    </Section>
  );
};

ProjectContact.displayName = "ProjectContact";
