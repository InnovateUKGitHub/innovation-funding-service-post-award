import React from "react";

interface Member {
    role: string;
    name: string;
    email: string;
}

interface Props {
    projectMembers: Member[];
    spacing?: string;
    heading: string;
}

export const ProjectMember: React.SFC<Props> = (props: Props) => {
    const renderProjectMember = (member: Member) => (
            <div className={props.spacing}>
                <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{member.role}</h3>
                <p className="govuk-body govuk-!-margin-bottom-0">{member.name}</p>
                <a href="" className="govuk-link govuk-!-font-size-19">{member.email}</a>
            </div>
        );

    return (
        <div>
            <h2 className={`govuk-heading-m ${props.spacing}`}>{props.heading}</h2>
            {props.projectMembers.map(renderProjectMember)}
        </div>
    );
};
