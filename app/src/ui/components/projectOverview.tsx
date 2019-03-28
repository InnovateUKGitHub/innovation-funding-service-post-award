import React, { ReactNode } from "react";
import { ProjectDashboardRoute } from "../containers";
import { PartnerDto, ProjectDto } from "../../types";
import { IAppError } from "../../types/IAppError";
import { Results } from "../validation/results";
import { ValidationSummary } from "./validationSummary";
import { ErrorSummary } from "./errorSummary";
import { Page, Section } from "./layout";
import { BackLink } from "./links";
import * as Projects from "./projects";
import * as Renderers from "./renderers";

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

const renderError = (error?: IAppError | null) => error && <ErrorSummary error={error} />;
const renderValidation = (validator?: Results<any> | null) => validator && <ValidationSummary validation={validator} compressed={false} />;

export const ProjectOverviewPage = ({ project, selectedTab, children, partnerId, partners, error, validator, backLinkText, messages }: Props) => (
  <Page>
    <Section>
      <BackLink route={ProjectDashboardRoute.getLink({})}>{backLinkText || "Back to all projects"}</BackLink>
    </Section>
    {renderError(error)}
    {renderValidation(validator)}
    <Projects.Title pageTitle="View project" project={project} />
    <Projects.ProjectNavigation project={project} currentRoute={selectedTab} partners={partners}/>
    <Renderers.Messages messages={messages || []} />
    {children}
  </Page>
);
