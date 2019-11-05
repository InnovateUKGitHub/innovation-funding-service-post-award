import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { StoresConsumer } from "@ui/redux";
import { PCRItemStatus, PCRItemType, PCRStatus } from "@framework/constants";

interface Params {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  statusChanges: Pending<ProjectChangeRequestStatusChangeDto[]>;
  editableItemTypes: Pending<PCRItemType[]>;
}

interface Callbacks {
}

class PCRDetailsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editableItemTypes: this.props.editableItemTypes });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editableItemTypes)} />;
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    const tabs = [{
      text: "Details",
      hash: "details",
      default: true,
      content: this.renderDetailsTab(project, projectChangeRequest, editableItemTypes),
      qa: "ProjectChangeRequestDetailsTab"
    }, {
      text: "Log",
      hash: "log",
      content: this.renderLogTab(),
      qa: "ProjectChangeRequestLogTab"
    }];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.HashTabs tabList={tabs} />
      </ACC.Page>
    );
  }

  private renderDetailsTab(project: ProjectDto, projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    return (
      <React.Fragment>
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr_details">
            <ACC.SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={projectChangeRequest.items.map(x => x.shortName)} />} qa="typesRow" />
          </ACC.SummaryList>
          <ACC.TaskList qa="taskList">
            {this.renderTaskListActions(projectChangeRequest, editableItemTypes)}
            {this.renderTaskListReasoning(projectChangeRequest, editableItemTypes)}
          </ACC.TaskList>
          {this.renderCommentsFromPM(project, projectChangeRequest)}
        </ACC.Section>
      </React.Fragment>
    );
  }

  private renderTaskListActions(projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    if (!editableItemTypes.length) return null;
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

    return (
      <ACC.TaskListSection step={1} title="Give us information" qa="WhatDoYouWantToDo">
        {editableItems.map((x) => this.getItemTasks(x))}
      </ACC.TaskListSection>
    );
  }

  private renderTaskListReasoning(projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
    const stepCount = editableItems.length ? 2 : 1;

    return (
      <ACC.TaskListSection step={stepCount} title="Explain why you want to make the changes" qa="reasoning">
        <ACC.Task
          name="Reasoning for Innovate UK"
          status={this.getTaskStatus(projectChangeRequest.reasoningStatus)}
          route={this.props.routes.pcrViewReasoning.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
        />
      </ACC.TaskListSection>
    );
  }

  private renderCommentsFromPM(project: ProjectDto, projectChangeRequest: PCRDto) {
    if ((project.roles & ProjectRole.MonitoringOfficer) && projectChangeRequest.comments && (projectChangeRequest.status === PCRStatus.Draft || projectChangeRequest.status === PCRStatus.QueriedByMonitoringOfficer)) {
      return (
        <ACC.Section title="Comments" qa="additionalComments">
          <ACC.Renderers.SimpleString multiline={true}>
            {projectChangeRequest.comments}
          </ACC.Renderers.SimpleString>
        </ACC.Section>
      );
    }
    return null;
  }

  private getItemTasks(item: PCRItemDto) {
    return (
      <ACC.Task
        name={item.shortName}
        status={this.getTaskStatus(item.status)}
        route={this.props.routes.pcrViewItem.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id })}
      />
    );
  }

  private getTaskStatus(status: PCRItemStatus): "To do" | "Complete" | "Incomplete" {
    switch (status) {
      case PCRItemStatus.Complete:
        return "Complete";
      case PCRItemStatus.Incomplete:
        return "Incomplete";
      case PCRItemStatus.ToDo:
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

const PCRDetailsContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRDetailsComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
        editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PCRDetailsRoute = defineRoute({
  routeName: "pcrDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/details",
  container: PCRDetailsContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
