import React from "react";
import { Email } from "./renderers/email";

export interface ProjectMember {
    roleName: string;
    name: string;
    email: string;
    organisation?: string;
}

interface Props {
    member?: ProjectMember | null;
    qa: string;
}

export const ProjectMember: React.SFC<Props> = (props) => {
    const { member } = props;
    if (!member) { return null; }

    const displayRole = member.organisation ? `${member.roleName} - ${member.organisation}` : member.roleName;

    return (
        <div className="govuk-heading-m govuk-!-margin-bottom-9">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{displayRole}</h3>
            <p className="govuk-body govuk-!-margin-bottom-0" data-qa={`${props.qa}-name`}>{member.name}</p>
            <Email value={member.email} qa={props.qa + "-email"} />
        </div>
    );
};
