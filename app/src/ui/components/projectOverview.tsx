import React, { ReactNode } from "react";
import * as ACC from "./index";
import { ProjectDashboardRoute, ProjectDetailsRoute } from "../containers";
import { PartnerDto, ProjectDto } from "../../types";
import { Results } from "../validation/results";
import { IAppError } from "../../types/IAppError";

interface Props {
    project: ProjectDto;
    partners: PartnerDto[];
    selectedTab: string;
    children: ReactNode;
    partnerId?: string;
    backLinkText?: string;
    error?: IAppError | null;
    validator?: Results<any> | null;
    messages?: string[];
}

const renderError = (error?: IAppError | null) => error && <ACC.ErrorSummary error={error} />;
const renderValidation = (validator?: Results<any> | null) => validator && <ACC.ValidationSummary validation={validator} compressed={false} />;

export const ProjectOverviewPage = ({ project, selectedTab, children, partnerId, partners, error, validator, backLinkText, messages }: Props) => (
    <ACC.Page>
        <ACC.Section>
            <ACC.BackLink route={ProjectDashboardRoute.getLink({})}>{backLinkText || "Back to all projects"}</ACC.BackLink>
        </ACC.Section>
        {renderError(error)}
        {renderValidation(validator)}
        <ACC.Projects.Title pageTitle="View project" project={project} />
        <ACC.Section>
          {renderProjectDetailsRoute(project.id)}
        </ACC.Section>
        <ACC.Projects.ProjectNavigation project={project} currentRoute={selectedTab} partners={partners}/>
        <ACC.Renderers.Messages messages={messages || []} />
        {children}
    </ACC.Page>
);

const renderProjectDetailsRoute = (projectId: string) => {
  const route = ProjectDetailsRoute.getLink({ id: projectId });
  return <ACC.Link route={route}>Contact details and project summary</ACC.Link>;
};
