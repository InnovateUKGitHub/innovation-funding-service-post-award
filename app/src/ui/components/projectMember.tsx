import React from "react";
import { Email } from "./renderers/email";

interface ProjectMember {
    role: string;
    name: string;
    email: string;
    organisation?: string;
}

interface Props {
    member: ProjectMember | null | undefined;
    qa: string;
}

export const ProjectMember: React.SFC<Props> = (props) => {
    const { member } = props;
    if (!member) { return null; }

    const displayRole = member.organisation ? `${member.role} - ${member.organisation}` : member.role;

    return (
        <div className="govuk-heading-m govuk-!-margin-bottom-9">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{displayRole}</h3>
            <p className="govuk-body govuk-!-margin-bottom-0" data-qa={`${props.qa}-name`}>{member.name}</p>
            <Email value={member.email} />
        </div>
    );
};
