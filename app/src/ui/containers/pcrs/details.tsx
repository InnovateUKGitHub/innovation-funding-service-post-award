import { getAuthRoles, ProjectDto, ProjectRole } from "@framework/types";

import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { useStores } from "@ui/redux";
import { PCRItemType, PCRStatus } from "@framework/constants";
import * as ACC from "../../components";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { getPcrItemTaskStatus } from "./utils/get-pcr-item-task-status";

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

class PCRDetailsComponent extends ContainerBase<Params, Data> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editableItemTypes: this.props.editableItemTypes,
    });

    return (
      <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editableItemTypes)} />
    );
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>
            Back to project change requests
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
      >
        {this.renderSummary(projectChangeRequest)}
        {this.renderTasks(projectChangeRequest, editableItemTypes)}
        {this.renderCommentsFromPM(project, projectChangeRequest)}
        {this.renderLog()}
      </ACC.Page>
    );
  }

  private renderSummary(projectChangeRequest: PCRDto) {
    return (
      <ACC.Section title="Details">
        <ACC.SummaryList qa="pcr_details">
          <ACC.SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
          <ACC.SummaryListItem
            label="Types"
            content={<ACC.Renderers.LineBreakList items={projectChangeRequest.items.map(x => x.shortName)} />}
            qa="typesRow"
          />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderTasks(projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    return (
      <ACC.List qa="taskList">
        {this.renderTaskListActions(projectChangeRequest, editableItemTypes)}
        {this.renderTaskListReasoning(projectChangeRequest, editableItemTypes)}
      </ACC.List>
    );
  }

  private renderTaskListActions(projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    if (!editableItemTypes.length) return null;
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

    return (
      <ACC.TaskListSection step={1} title={x => x.taskList.giveUsInfoSectionTitle} qa="WhatDoYouWantToDo">
        {editableItems.map(x => this.getItemTasks(x))}
      </ACC.TaskListSection>
    );
  }

  private renderTaskListReasoning(projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
    const stepCount = editableItems.length ? 2 : 1;

    return (
      <ACC.TaskListSection step={stepCount} title={x => x.taskList.explainSectionTitle} qa="reasoning">
        <ACC.Task
          name="Reasoning for Innovate UK"
          status={getPcrItemTaskStatus(projectChangeRequest.reasoningStatus)}
          route={this.props.routes.pcrViewReasoning.getLink({
            projectId: this.props.projectId,
            pcrId: this.props.pcrId,
          })}
        />
      </ACC.TaskListSection>
    );
  }

  private renderCommentsFromPM(project: ProjectDto, projectChangeRequest: PCRDto) {
    const { isMo } = getAuthRoles(project.roles);
    if (
      isMo &&
      projectChangeRequest.comments &&
      (projectChangeRequest.status === PCRStatus.Draft ||
        projectChangeRequest.status === PCRStatus.QueriedByMonitoringOfficer)
    ) {
      return (
        <ACC.Section title="Comments" qa="additionalComments">
          <ACC.Renderers.SimpleString multiline>{projectChangeRequest.comments}</ACC.Renderers.SimpleString>
        </ACC.Section>
      );
    }
    return null;
  }

  private getItemTasks(item: PCRItemDto) {
    return (
      <ACC.Task
        name={item.typeName}
        status={getPcrItemTaskStatus(item.status)}
        route={this.props.routes.pcrViewItem.getLink({
          projectId: this.props.projectId,
          pcrId: this.props.pcrId,
          itemId: item.id,
        })}
      />
    );
  }

  private renderLog() {
    return (
      <ACC.Accordion>
        <ACC.AccordionItem title="Status and comments log" qa="status-and-comments-log">
          {/* Keeping logs inside loader because accordion defaults to closed*/}
          <ACC.Loader
            pending={this.props.statusChanges}
            render={statusChanges => <ACC.Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" />}
          />
        </ACC.AccordionItem>
      </ACC.Accordion>
    );
  }
}

const PCRDetailsContainer = (props: Params & BaseProps) => {
  const stores = useStores();

  return (
    <PCRDetailsComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
      statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
      editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
    />
  );
};

export const PCRDetailsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "pcrDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/details",
  container: PCRDetailsContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
