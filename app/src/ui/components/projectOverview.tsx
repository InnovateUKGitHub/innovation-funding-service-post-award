import React, { ReactNode } from "react";
import * as ACC from "./index";
import { ProjectDashboardRoute } from "../containers";
import { ProjectDto } from "../../types";
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
}

const renderError = (error?: IAppError | null) => error && <ACC.ErrorSummary error={error} />;
const renderValidation = (validator?: Results<any> | null) => validator && <ACC.ValidationSummary validation={validator} compressed={false} />;

export const ProjectOverviewPage = ({ project, selectedTab, children, partnerId, partners, error, validator, backLinkText }: Props) => (
    <ACC.Page>
        <ACC.Section>
            <ACC.BackLink route={ProjectDashboardRoute.getLink({})}>{backLinkText || "Back to dashboard"}</ACC.BackLink>
        </ACC.Section>
        {renderError(error)}
        {renderValidation(validator)}
        <ACC.Projects.Title pageTitle="View project" project={project} />
        <ACC.Projects.ProjectNavigation project={project} currentRoute={selectedTab} partnerId={partnerId} partners={partners}/>
        {children}
    </ACC.Page>
);
