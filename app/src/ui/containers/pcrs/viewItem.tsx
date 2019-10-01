import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRDetailsRoute } from "./details";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { State as RouteState } from "router5";
import { RootState } from "@ui/redux";
import { PCRReviewRoute } from "./review";
import { NavigationArrowsForPCRs } from "./navigationArrows";

interface Params {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  pcrItem: Pending<PCRItemDto>;
  files: Pending<DocumentSummaryDto[]>;
  isReviewing: boolean;
}

interface Callbacks {
}

class PCRViewItemComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, pcrItem: this.props.pcrItem, files: this.props.files });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.pcrItem, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, pcrItem: PCRItemDto, files: DocumentSummaryDto[]) {
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
          <ACC.SummaryList qa="pcr_viewItem">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Type" content={pcrItem.typeName} qa="type"/>
            <ACC.SummaryListItem
              label="Files"
              qa="files"
              content={files.length ? <ACC.DocumentList documents={files} qa="docs" /> : "No documents attached"}
            />
          </ACC.SummaryList>
        </ACC.Section>
        <NavigationArrowsForPCRs pcr={pcr} currentItem={pcrItem} isReviewing={this.props.isReviewing}/>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRViewItemComponent);

const withData = (isReviewing: boolean) => (state: RootState, params: Params) => ({
  project: Selectors.getProject(params.projectId).getPending(state),
  pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
  pcrItem: Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(state),
  files: Selectors.getProjectChangeRequestDocumentsOrItemDocuments(params.itemId).getPending(state),
  isReviewing
});

const getParams = (route: RouteState): Params => ({
  projectId: route.params.projectId,
  pcrId: route.params.pcrId,
  itemId: route.params.itemId
});

const loadDataActions = (params: Params) => ([
  Actions.loadProject(params.projectId),
  Actions.loadPcr(params.projectId, params.pcrId),
  Actions.loadProjectChangeRequestDocumentsOrItemDocuments(params.projectId, params.itemId)
]);

export const PCRViewItem = definition.connect({
  withData: withData(false),
  withCallbacks: () => ({})
});

export const PCRViewItemRoute = definition.route({
  routeName: "pcrViewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/item/:itemId",
  getParams,
  getLoadDataActions: loadDataActions,
  getTitle: (store, params) => {
    const typeName = Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(store).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `${typeName}` : "Project change request item",
      displayTitle: typeName ? `${typeName}` : "Project change request item",
    };
  },
  container: PCRViewItem,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});

export const PCRReviewItem = definition.connect({
  withData: withData(true),
  withCallbacks: () => ({})
});

export const PCRReviewItemRoute = definition.route({
  routeName: "pcrReviewItem",
  routePath: "/projects/:projectId/pcrs/:pcrId/review/item/:itemId",
  getParams,
  getLoadDataActions: loadDataActions,
  getTitle: (store, params) => {
    const typeName = Selectors.getPcrItem(params.projectId, params.pcrId, params.itemId).getPending(store).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Review ${typeName}` : "Review project change request item",
      displayTitle: typeName ? `Review ${typeName}` : "Review project change request item",
    };
  },
  container: PCRReviewItem,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
