import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRDetailsRoute } from "./details";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { RootState } from "@ui/redux";
import { State as RouteState } from "router5";
import { PCRReviewRoute } from "./review";
import { NavigationArrowsForPCRs } from "./navigationArrows";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  files: Pending<DocumentSummaryDto[]>;
  isReviewing: boolean;
}

interface Callbacks {
}

class PCRViewReasoningComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, files: DocumentSummaryDto[]) {
    const backLink = this.props.isReviewing ?
      <ACC.BackLink route={PCRReviewRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to review project change request</ACC.BackLink> :
      <ACC.BackLink route={PCRDetailsRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to project change request details</ACC.BackLink>
      ;
    return (
      <ACC.Page
        backLink={backLink}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr_reasoning">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.typeName)}/>} qa="typesRow" />
            <ACC.SummaryListItem label="Comments" content={pcr.reasoningComments} qa="comments" />
            <ACC.SummaryListItem
              label="Files"
              content={files.length ? <ACC.DocumentList documents={files} qa="docs" /> : "No documents attached"}
              qa="files"
            />
          </ACC.SummaryList>
        </ACC.Section>
        <NavigationArrowsForPCRs pcr={pcr} currentItem={null} isReviewing={this.props.isReviewing}/>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRViewReasoningComponent);

const withData = (isReviewing: boolean) => (state: RootState, params: Params) => ({
  project: Selectors.getProject(params.projectId).getPending(state),
  pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
  files: Selectors.getProjectChangeRequestDocumentsOrItemDocuments(params.pcrId).getPending(state),
  isReviewing
});

const getParams = (route: RouteState): Params => ({
  projectId: route.params.projectId,
  pcrId: route.params.pcrId
});

const loadDataActions = (params: Params) => ([
  Actions.loadProject(params.projectId),
  Actions.loadPcr(params.projectId, params.pcrId),
  Actions.loadProjectChangeRequestDocumentsOrItemDocuments(params.projectId, params.pcrId),
]);

export const PCRViewReasoning = definition.connect({
  withData: withData(false),
  withCallbacks: () => ({})
});

export const PCRViewReasoningRoute = definition.route({
  routeName: "pcrViewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/reasoning",
  getParams,
  getLoadDataActions: loadDataActions,
  getTitle: () => ({
    htmlTitle: "Project change request reasoning",
    displayTitle: "Project change request reasoning"
  }),
  container: PCRViewReasoning,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});

export const PCRReviewReasoning = definition.connect({
  withData: withData(true),
  withCallbacks: () => ({})
});

export const PCRReviewReasoningRoute = definition.route({
  routeName: "pcrReviewReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/reasoning",
  getParams,
  getLoadDataActions: loadDataActions,
  getTitle: () => ({
    htmlTitle: "Review project change request reasoning",
    displayTitle: "Review project change request reasoning"
  }),
  container: PCRReviewReasoning,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
