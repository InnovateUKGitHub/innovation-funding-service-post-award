import React from "react";
import { Email } from "./renderers/email";
import { PartnerDto } from "@framework/dtos";
import { PartnerName } from "@ui/components/partners";

interface Props {
    contact?: ProjectContactDto | null;
    partner?: PartnerDto | null;
    qa: string;
}

export const ProjectContact: React.FunctionComponent<Props> = (props) => {

    const contact = props.contact;

    const partner = props.partner;

    if (!contact) { return null; }

    return (
        <div className="govuk-heading-m govuk-!-margin-bottom-9">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-0" data-qa={`${props.qa}-roleName`}>{contact.roleName}</h3>
            <p className="govuk-body govuk-!-margin-bottom-0" data-qa={`${props.qa}-name`}>{contact.name}</p>
            <p className="govuk-body govuk-!-margin-bottom-0" data-qa={`${props.qa}-partner`}><PartnerName partner={partner}/></p>
            <Email value={contact.email} qa={props.qa + "-email"} />
        </div>
    );
};
