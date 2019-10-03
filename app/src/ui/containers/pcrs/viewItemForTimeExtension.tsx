import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import { PCRDto, PCRItemForTimeExtensionDto, ProjectDto, ProjectRole } from "@framework/dtos";
import React from "react";
import { PCRDetailsRoute, PCRReviewRoute } from "@ui/containers";
import { BaseProps, ContainerBase, defineRoute, ReduxContainer } from "@ui/containers/containerBase";
import { RootState, StoresConsumer } from "@ui/redux";
import { State as RouteState } from "router5";
import { NavigationArrowsForPCRs } from "./navigationArrows";

interface Params {
  projectId: string;
  projectChangeRequestId: string;
  projectChangeRequestItemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  projectChangeRequest: Pending<PCRDto>;
  projectChangeRequestItem: Pending<PCRItemForTimeExtensionDto>;
  isReviewing: boolean;
}

interface Callbacks {
}

class ProjectChangeRequestViewItemForTimeExtensionComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      projectChangeRequest: this.props.projectChangeRequest,
      projectChangeRequestItem: this.props.projectChangeRequestItem
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.projectChangeRequest, x.projectChangeRequestItem)} />;
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto, projectChangeRequestItem: PCRItemForTimeExtensionDto) {
    const backLink = this.props.isReviewing ?
      <ACC.BackLink route={PCRReviewRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.projectChangeRequestId })}>Back to review project change request</ACC.BackLink> :
      <ACC.BackLink route={PCRDetailsRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.projectChangeRequestId })}>Back to view project change request</ACC.BackLink>;

    return (
      <ACC.Page
        backLink={backLink}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Section title="Details">
          <ACC.SummaryList qa="timeExtensionSummaryList">
            <ACC.SummaryListItem label="Current end date" content={<ACC.Renderers.ShortDate value={project.endDate} />} qa="currentEndDate" />
            <ACC.SummaryListItem label="Current duration" content={<ACC.Renderers.Duration startDate={project.startDate} endDate={project.endDate} />} qa="currentDuration" />
            <ACC.SummaryListItem label="New end date" content={<ACC.Renderers.ShortDate value={projectChangeRequestItem.projectEndDate} />} qa="newEndDate" />
            <ACC.SummaryListItem label="New duration" content={<ACC.Renderers.Duration startDate={project.startDate} endDate={projectChangeRequestItem.projectEndDate} />} qa="newDuration" />
          </ACC.SummaryList>
        </ACC.Section>
        <NavigationArrowsForPCRs pcr={projectChangeRequest} currentItem={projectChangeRequestItem} isReviewing={this.props.isReviewing} />
      </ACC.Page>
    );
  }
}

const ProjectChangeRequestViewItemForTimeExtensionContainer = (props: Params & BaseProps & { isReviewing: boolean}) => (
  <StoresConsumer>
    {stores => (
      <ProjectChangeRequestViewItemForTimeExtensionComponent
        project={stores.projects.getById(props.projectId)}
        projectChangeRequest={stores.projectChangeRequests.getById(props.projectId, props.projectChangeRequestId)}
        projectChangeRequestItem={stores.projectChangeRequests.getTimeExtentionItemById(props.projectId, props.projectChangeRequestId, props.projectChangeRequestItemId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

const getParams = (route: RouteState): Params => ({
  projectId: route.params.projectId,
  projectChangeRequestId: route.params.projectChangeRequestId,
  projectChangeRequestItemId: route.params.projectChangeRequestItemId
});

export const ProjectChangeRequestViewItemForTimeExtensionRoute = defineRoute({
  routeName: "projectChangeRequestViewItemForTimeExtension",
  routePath: "/projects/:projectId/pcrs/:projectChangeRequestId/details/timeExtension/:projectChangeRequestItemId",
  container: (props) => <ProjectChangeRequestViewItemForTimeExtensionContainer isReviewing={false} {...props}/>,
  getParams,
  getTitle: (store, params) => {
    const typeName = Selectors.getPcrItem(params.projectId, params.projectChangeRequestId, params.projectChangeRequestItemId).getPending(store).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `${typeName}` : "Project change request item",
      displayTitle: typeName ? `${typeName}` : "Project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer || ProjectRole.ProjectManager)
});

export const ProjectChangeRequestReviewItemForTimeExtensionRoute = defineRoute({
  routeName: "projectChangeRequestReviewItemForTimeExtension",
  routePath: "/projects/:projectId/pcrs/:projectChangeRequestId/review/timeExtension/:projectChangeRequestItemId",
  container: (props) => <ProjectChangeRequestViewItemForTimeExtensionContainer isReviewing={true} {...props}/>,
  getParams,
  getTitle: (store, params) => {
    const typeName = Selectors.getPcrItem(params.projectId, params.projectChangeRequestId, params.projectChangeRequestItemId).getPending(store).then(x => x.typeName).data;
    return {
      htmlTitle: typeName ? `Review ${typeName}` : "Review project change request item",
      displayTitle: typeName ? `Review ${typeName}` : "Review project change request item",
    };
  },
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer)
});
