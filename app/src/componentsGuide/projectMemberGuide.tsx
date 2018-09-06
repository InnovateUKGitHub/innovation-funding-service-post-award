import React from "react";
import { ProjectMember } from "../components/projectMember";

export const projectMemberGuide: IGuide = {
    name: "Project member",
    options: [
        {
            name: "Simple",
            comments: `Renders information about a project member`,
            example: `<ProjectMember member={{name: "Ms A Bloggs", email: "a.bloggs@test.com", role: "Team lead"}} />`,
            render: () => <ProjectMember member={{ name: "Ms A Bloggs", email: "a.bloggs@test.com", role: "Team lead" }} qa={"member1"} />,
        },
        {
            name: "With organisation",
            comments: `Renders information about a project member including their organisation`,
            example: `<ProjectMember member={{name: "Ms A Bloggs", email: "a.bloggs@test.com", role: "Team lead", organisation: "Acme"}} />`,
            render: () => <ProjectMember member={{ name: "Ms A Bloggs", email: "a.bloggs@test.com", role: "Team lead", organisation: "Acme" }} qa={"member1"} />,
        },
    ]
};
