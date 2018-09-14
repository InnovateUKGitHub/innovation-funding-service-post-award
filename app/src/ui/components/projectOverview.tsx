import React, { ReactNode } from "react";
import * as ACC from "./index";
import { routeConfig } from "../routing/index";
import { ProjectDto } from "../models/index";

interface Props {
    project: ProjectDto;
    selectedTab: string;
    children: ReactNode;
    partnerId?: string;
}

export const ProjectOverviewPage: React.SFC<Props> = ({ project, selectedTab, children, partnerId }) => (
    <ACC.Page>
        <ACC.Section>
            <ACC.BackLink route={routeConfig.projectDashboard.getLink({})}>Main dashboard</ACC.BackLink>
        </ACC.Section>
        <ACC.Projects.Title pageTitle="View project" project={project} />
        <ACC.Projects.ProjectNavigation project={project} currentRoute={selectedTab} partnerId={partnerId}/>
        {children}
    </ACC.Page>
);
