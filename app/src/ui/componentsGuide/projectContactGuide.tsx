import React from "react";
import { ProjectContact } from "../components/projectContact";
import { PartnerDto, ProjectContactDto } from "@framework/dtos";
import { createDto } from "@framework/util";
import { IGuide } from "@framework/types";

const partner = createDto<PartnerDto>({ name: "aTestOrganisation"});

const contact = createDto<ProjectContactDto>({name: "Ms A Bloggs", email: "a.bloggs@test.com", roleName: "Team lead"});

export const projectContactGuide: IGuide = {
    name: "Project contact",
    options: [
        {
            name: "Simple",
            comments: `Renders information about a project contact`,
            example: `<ProjectMember contact={member} qa={"member1"} />`,
            render: () => <ProjectContact contact={contact} qa={"member1"} />,
        },
        {
            name: "With partner",
            comments: `Renders information about a project member including their organisation`,
            example: `<ProjectMember contact={member} partner={partner} qa={"member1"} />`,
            render: () => <ProjectContact contact={contact} partner={partner} qa={"member1"} />,
        },
    ]
};
