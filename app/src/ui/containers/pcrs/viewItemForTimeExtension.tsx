import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions";
import * as Selectors from "@ui/redux/selectors";
import { PCRDto, PCRItemForTimeExtensionDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { PCRReviewRoute, PCRViewReasoningRoute } from "@ui/containers";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";

interface Params {
  projectId: string;
  projectChangeRequestId: string;
  projectChangeRequestItemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  projectChangeRequest: Pending<PCRDto>;
  projectChangeRequestItem: Pending<PCRItemForTimeExtensionDto>;
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
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRReviewRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.projectChangeRequestId })}>Back to review project change request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Section title="Details">
          <ACC.SummaryList qa="timeExtensionSummaryList">
            <ACC.SummaryListItem label="Current end date" content={<ACC.Renderers.ShortDate value={project.endDate} />} qa="currentEndDate"/>
            <ACC.SummaryListItem label="Current duration" content={<ACC.Renderers.Duration startDate={project.startDate} endDate={project.endDate} />} qa="currentDuration"/>
            <ACC.SummaryListItem label="New end date" content={<ACC.Renderers.ShortDate value={projectChangeRequestItem.projectEndDate} />} qa="newEndDate"/>
            <ACC.SummaryListItem label="New duration" content={<ACC.Renderers.Duration startDate={project.startDate} endDate={projectChangeRequestItem.projectEndDate} />} qa="newDuration"/>
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.NavigationArrows previousLink={null} nextLink={{label: "Reasoning", route: PCRViewReasoningRoute.getLink({pcrId: this.props.projectChangeRequestId, projectId: this.props.projectId})}}/>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(ProjectChangeRequestViewItemForTimeExtensionComponent);

export const ProjectChangeRequestViewItemForTimeExtension = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    projectChangeRequest: Selectors.getPcr(params.projectId, params.projectChangeRequestId).getPending(state),
    projectChangeRequestItem: Selectors.getPcrItemForTimeExtension(state, params.projectId, params.projectChangeRequestId, params.projectChangeRequestItemId)
  }),
  withCallbacks: () => ({})
});

export const ProjectChangeRequestViewItemForTimeExtensionRoute = definition.route({
  routeName: "projectChangeRequestViewItemForTimeExtension",
  routePath: "/projects/:projectId/pcrs/:pcrId/details/timeExtension/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    projectChangeRequestId: route.params.pcrId,
    projectChangeRequestItemId: route.params.itemId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.projectChangeRequestId)
  ],
  getTitle: () => ({
    htmlTitle: "View time extension details",
    displayTitle: "View time extension details"
  }),
  container: ProjectChangeRequestViewItemForTimeExtension,
  accessControl: (auth, {projectId}, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer || ProjectRole.ProjectManager)
});
