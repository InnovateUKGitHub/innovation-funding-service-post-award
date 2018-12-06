import React, { ReactNode } from "react";
import * as ACC from "./index";
import { ProjectDashboardRoute } from "../containers";
import { ProjectDto } from "../../types";
import { IEditorStore } from "../redux/reducers";
import { Results } from "../validation/results";

interface Props<Dto> {
    project: ProjectDto;
    partners: PartnerDto[];
    selectedTab: string;
    children: ReactNode;
    partnerId?: string;
    editor?: IEditorStore<Dto, Results<Dto>> | null;
    backLinkText?: string;
}

const renderErrors = <Dto, V>(editor?: IEditorStore<Dto, Results<Dto>> | null) => {
  if (!editor) return null;
  return (
    <React.Fragment>
      <ACC.ErrorSummary error={editor.error} />
      <ACC.ValidationSummary validation={editor.validator} compressed={false} />
    </React.Fragment>
  );
};

export const ProjectOverviewPage = <Dto, V>({ project, selectedTab, children, partnerId, partners, editor, backLinkText }: Props<Dto>) => (
    <ACC.Page>
        <ACC.Section>
            <ACC.BackLink route={ProjectDashboardRoute.getLink({})}>{backLinkText || "Back to dashboard"}</ACC.BackLink>
        </ACC.Section>
        {renderErrors(editor)}
        <ACC.Projects.Title pageTitle="View project" project={project} />
        <ACC.Projects.ProjectNavigation project={project} currentRoute={selectedTab} partnerId={partnerId} partners={partners}/>
        {children}
    </ACC.Page>
);
