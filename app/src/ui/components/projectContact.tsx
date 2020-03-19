import React from "react";
import { Email } from "./renderers/email";
import { PartnerDto } from "@framework/dtos";
import { PartnerName } from "@ui/components/partners";
import { Section } from "@ui/components/layout";
import { SimpleString } from "@ui/components/renderers";

interface Props {
  contact?: ProjectContactDto | null;
  partner?: PartnerDto | null;
  qa: string;
}

export const ProjectContact: React.FunctionComponent<Props> = (props) => {

  const contact = props.contact;

  const partner = props.partner;

  if (!contact) {
    return null;
  }

  return (
    <Section title={contact.roleName}>
      <SimpleString className={"govuk-!-margin-bottom-0"} data-qa={`${props.qa}-roleName`}>{contact.name}</SimpleString>
      <SimpleString className={"govuk-!-margin-bottom-0"} data-qa={`${props.qa}-name`}><PartnerName partner={partner}/></SimpleString>
      <Email value={contact.email} qa={props.qa + "-email"}/>
    </Section>
  );
};
