import { PartnerDto, ProjectContactDto } from "@framework/dtos";

import { Section, getPartnerName } from "@ui/components";
import { SimpleString, Email } from "@ui/components/renderers";

export interface ProjectContactProps {
  contact?: ProjectContactDto;
  partner?: PartnerDto;
  qa: string;
}

export function ProjectContact({ contact, partner, qa }: ProjectContactProps) {
  if (!contact) return null;

  return (
    <Section title={contact.roleName}>
      <SimpleString className="govuk-!-margin-bottom-0" qa={`${qa}-roleName`}>
        {contact.name}
      </SimpleString>

      {partner && (
        <SimpleString className="govuk-!-margin-bottom-0" qa={`${qa}-name`}>
          {getPartnerName(partner)}
        </SimpleString>
      )}

      <Email qa={`${qa}-email`}>{contact.email}</Email>
    </Section>
  );
}
