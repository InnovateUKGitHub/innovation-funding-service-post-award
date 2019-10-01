import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Selectors from "../../redux/selectors";
import * as Actions from "@ui/redux/actions";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { ProjectChangeRequestViewItemForTimeExtensionRoute } from "./viewItemForTimeExtension";
import { PCRViewItemRoute } from "./viewItem";
import { PCRViewReasoningRoute } from "./viewReasoning";
import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity } from "@framework/entities";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  statusChanges: Pending<ProjectChangeRequestStatusChangeDto[]>;
}

interface Callbacks {
}

class PCRDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr)} />;
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto) {
    const tabs = [{
      text: "Details",
      hash: "details",
      default: true,
      content: this.renderDetailsTab(projectChangeRequest),
      qa: "ProjectChangeRequestDetailsTab"
    }, {
      text: "Log",
      hash: "log",
      content: this.renderLogTab(),
      qa: "ProjectChangeRequestLogTab"
    }];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.HashTabs tabList={tabs} />
      </ACC.Page>
    );
  }

  private renderDetailsTab(projectChangeRequest: PCRDto ) {
    return (
      <React.Fragment>

        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr_details">
            <ACC.SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={projectChangeRequest.items.map(x => x.typeName)}/>} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.TaskList qa="taskList">
          {projectChangeRequest.items.map((x, i) => (
            <ACC.TaskListSection key={i} step={i + 1} title={x.typeName} qa={`task-${i}`}>
              {this.getItemTasks(x)}
            </ACC.TaskListSection>
          ))}
          <ACC.TaskListSection step={projectChangeRequest.items.length + 1} title={"View more details"} qa="reasoning">
            <ACC.Task
              name="Reasoning for Innovate UK"
              status={this.getTaskStatus(projectChangeRequest.reasoningStatus)}
              route={PCRViewReasoningRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
            />
          </ACC.TaskListSection>
        </ACC.TaskList>
      </React.Fragment>
    );
  }

  private getItemTasks(item: PCRItemDto) {
    // tslint:disable:no-small-switch TODO remove this when more added
    switch (item.type) {
      case ProjectChangeRequestItemTypeEntity.TimeExtension:
        return (
          <ACC.Task
            name="View new end date for project"
            status={this.getTaskStatus(item.status)}
            route={ProjectChangeRequestViewItemForTimeExtensionRoute.getLink({ projectId: this.props.projectId, projectChangeRequestId: this.props.pcrId, projectChangeRequestItemId: item.id })}
          />
        );
      default:
        return (
          <ACC.Task
            name="View files"
            status={this.getTaskStatus(item.status)}
            route={PCRViewItemRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id })}
          />
        );
    }
  }

  private getTaskStatus(status: ProjectChangeRequestItemStatus): "To do" | "Complete" | "Incomplete" {
    switch (status) {
      case ProjectChangeRequestItemStatus.Complete:
        return "Complete";
      case ProjectChangeRequestItemStatus.Incomplete:
        return "Incomplete";
      case ProjectChangeRequestItemStatus.ToDo:
      default:
        return "To do";
    }
  }

  private renderLogTab() {
    return (
      <ACC.Loader
        pending={this.props.statusChanges}
        render={(statusChanges) => <ACC.Section title="Log"><ACC.Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" /></ACC.Section>}
      />
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(PCRDetailsComponent);

export const PCRDetails = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    statusChanges: Selectors.getProjectChangeRequestStatusChanges(params.pcrId).getPending(state)
  }),
  withCallbacks: () => ({})
});

export const PCRDetailsRoute = definition.route({
  routeName: "pcrDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/details",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadProjectChangeRequestStatusChanges(params.projectId, params.pcrId)
  ],
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request"
  }),
  container: PCRDetails,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
