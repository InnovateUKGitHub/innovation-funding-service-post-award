import React, { ReactNode } from "react";
import * as ACC from "./index";
import { ProjectDashboardRoute } from "../containers";
import { ProjectDto } from "../../types";
import { IEditorStore } from "../redux/reducers";

interface Props {
    project: ProjectDto;
    partners: PartnerDto[];
    selectedTab: string;
    children: ReactNode;
    partnerId?: string;
    editor?: IEditorStore;
}

export const ProjectOverviewPage: React.SFC<Props> = ({ project, selectedTab, children, partnerId, partners, editor }) => (
    <ACC.Page>
        <ACC.Section>
            <ACC.BackLink route={ProjectDashboardRoute.getLink({})}>Main dashboard</ACC.BackLink>
        </ACC.Section>
        <ACC.ValidationSummary validation={editor && editor.validator} compressed={false} />
        <ACC.Projects.Title pageTitle="View project" project={project} />
        <ACC.Projects.ProjectNavigation project={project} currentRoute={selectedTab} partnerId={partnerId} partners={partners}/>
        {children}
    </ACC.Page>
);
