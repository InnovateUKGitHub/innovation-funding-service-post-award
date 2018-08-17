import React from "react";

interface ProjectMember {
    role: string;
    name: string;
    email: string;
    organisation?: string;
}

interface Props {
    member: ProjectMember|null|undefined;
}

export const  ProjectMember: React.SFC<Props> = (props) => {
    let {member} = props;
    if(!member) return null;

    let displayRole = member.organisation ? `${member.role} - ${member.organisation}` : member.role;

    return (
        <div className="govuk-heading-m govuk-!-margin-bottom-9">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{displayRole}</h3>
            <p className="govuk-body govuk-!-margin-bottom-0">{member.name}</p>
            <a href="" className="govuk-link govuk-!-font-size-19">{member.email}</a>
        </div>
    );
}
