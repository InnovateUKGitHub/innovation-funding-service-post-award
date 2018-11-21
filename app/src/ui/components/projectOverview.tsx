import React, { ReactNode } from "react";
import * as ACC from "./index";
import { ProjectDashboardRoute } from "../containers";
import { ProjectDto } from "../../types";

interface Props {
    project: ProjectDto;
    partners: PartnerDto[];
    selectedTab: string;
    children: ReactNode;
    partnerId?: string;
    validationMessage?: ReactNode;
    backLinkText?: string;
}

export const ProjectOverviewPage: React.SFC<Props> = ({ project, selectedTab, children, partnerId, partners, validationMessage, backLinkText }) => (
    <ACC.Page>
        <ACC.Section>
            <ACC.BackLink route={ProjectDashboardRoute.getLink({})}>{backLinkText || "Main dashboard"}</ACC.BackLink>
        </ACC.Section>
        {validationMessage}
        <ACC.Projects.Title pageTitle="View project" project={project} />
        <ACC.Projects.ProjectNavigation project={project} currentRoute={selectedTab} partnerId={partnerId} partners={partners}/>
        {children}
    </ACC.Page>
);
