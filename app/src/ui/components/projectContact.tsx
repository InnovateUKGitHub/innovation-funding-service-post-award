import { PartnerDto, ProjectContactDto } from "@framework/dtos";
import { getPartnerName, Section } from "@ui/components";
import { Email, SimpleString } from "@ui/components/renderers";
import { ReactNode } from "react";

export interface ProjectContactProps {
  contact?: ProjectContactDto;
  partner?: PartnerDto;
  qa: string;
  comment?: ReactNode;
}

export function ProjectContact({ contact, partner, qa, comment }: ProjectContactProps) {
  if (!contact) return null;

  return (
    <Section title={contact.roleName}>
      {comment && (
        <SimpleString qa={`${qa}-roleComment`}>
          {comment}
        </SimpleString>
      )}

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
