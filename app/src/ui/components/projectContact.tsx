import React from "react";
import { Email } from "./renderers/email";
import { PartnerDto } from "@framework/dtos";
import { PartnerName } from "@ui/components/partners";
import { Section } from "@ui/components/layout";
import { SimpleString } from "@ui/components/renderers";

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

      <Email value={contact.email} qa={`${qa}-email`} />
    </Section>
  );
};

ProjectContact.displayName = "ProjectContact";
