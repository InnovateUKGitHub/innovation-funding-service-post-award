import React from "react";

interface ProjectMember {
    role: string;
    name: string;
    email: string;
}

interface Props {
    projectMembers: ProjectMember[];
    className?: string;
}

export const ProjectMembers: React.SFC<Props> = (props: Props) => {
    const renderProjectMember = (member: ProjectMember) => (
        <div className={props.className}>
            <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{member.role}</h3>
            <p className="govuk-body govuk-!-margin-bottom-0">{member.name}</p>
            <a href="" className="govuk-link govuk-!-font-size-19">{member.email}</a>
        </div>
    );

    return (
      <div>
          <h2 className={`govuk-heading-m ${props.className}`}>Project Members</h2>
          {props.projectMembers.map(renderProjectMember)}
      </div>
    );
};
