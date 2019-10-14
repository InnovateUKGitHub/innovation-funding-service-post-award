import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { PCRItemDto, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStatus } from "@framework/entities";

export interface ProjectChangeRequestPrepareParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  statusChanges: Pending<ProjectChangeRequestStatusChangeDto[]>;
  editableItemTypes: Pending<ProjectChangeRequestItemTypeEntity[]>;
}

interface Callbacks {
  onChange: (save: boolean, dto: PCRDto) => void;
}

class PCRPrepareComponent extends ContainerBase<ProjectChangeRequestPrepareParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editor: this.props.editor, editableItemTypes: this.props.editableItemTypes });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor, x.editableItemTypes)} />;
  }

  private onSave(editor: IEditorStore<PCRDto, PCRDtoValidator>, original: PCRDto, submit: boolean) {
    const dto = editor.data;
    if (submit && original.status === ProjectChangeRequestStatus.QueriedByInnovateUK) {
      dto.status = ProjectChangeRequestStatus.SubmittedToInnovationLead;
    }
    else if (submit) {
      dto.status = ProjectChangeRequestStatus.SubmittedToMonitoringOfficer;
    }
    else {
      // not submitting so set status to the original status
      dto.status = original.status;
    }
    this.props.onChange(true, dto);
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: ProjectChangeRequestItemTypeEntity[]) {
    const tabs = [{
      text: "Details",
      hash: "details",
      default: true,
      content: this.renderDetailsTab(projectChangeRequest, editor, editableItemTypes),
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
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.HashTabs tabList={tabs} />
      </ACC.Page>
    );
  }

  private renderDetailsTab(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: ProjectChangeRequestItemTypeEntity[]) {
    const Form = ACC.TypedForm<PCRDto>();
    return (
      <React.Fragment>
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr-prepare">
            <ACC.SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={projectChangeRequest.items.map(x => x.typeName)} />} action={<ACC.Link route={this.props.routes.ProjectChangeRequestAddType.getLink({ projectId: this.props.projectId, projectChangeRequestId: this.props.pcrId })}>Add types</ACC.Link>} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.TaskList qa="taskList">
          {this.renderTaskListActions(projectChangeRequest, editor, editableItemTypes)}
          {this.renderTaskListReasoning(projectChangeRequest, editor, editableItemTypes)}
        </ACC.TaskList>
        <Form.Form
          editor={editor}
          onChange={dto => this.props.onChange(false, dto)}
          onSubmit={() => this.onSave(editor, projectChangeRequest, true)}
        >
          <Form.Fieldset heading="Add comments for your monitoring officer">
            <Form.MultilineString
              name="comments"
              hint="Leave this field empty if there is nothing to add."
              value={x => x.comments}
              update={(m, v) => m.comments = v || ""}
              validation={editor.validator.comments}
              qa="info-text-area"
            />
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-submit">
            <Form.Submit>Submit request to monitoring officer</Form.Submit>
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-return">
            <Form.Button name="return" onClick={() => this.onSave(editor, projectChangeRequest, false)}>Save and return to requests</Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </React.Fragment>
    );
  }

  private renderTaskListActions(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: ProjectChangeRequestItemTypeEntity[]) {
    if (!editableItemTypes.length) return null;
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

    return (
      <ACC.TaskListSection step={1} title="What do you want to do?" qa="WhatDoYouWantToDo">
        {editableItems.map((x, i) => this.getItemTasks(x, editor, i))}
      </ACC.TaskListSection>
    );
  }

  private renderTaskListReasoning(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: ProjectChangeRequestItemTypeEntity[]) {
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
    const stepCount = editableItems.length ? 2 : 1;

    return (
      <ACC.TaskListSection step={stepCount} title="Give more details" validation={[editor.validator.reasoningStatus, editor.validator.reasoningComments]} qa="reasoning">
        <ACC.Task
          name="Provide reasoning to Innovate UK"
          status={this.getTaskStatus(projectChangeRequest.reasoningStatus)}
          route={this.props.routes.pcrPrepareReasoning.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
        />
      </ACC.TaskListSection>
    );
  }

  private getItemTasks(item: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, index: number) {
    const validationErrors = editor.validator.items.results[index].errors;

    return (
      <ACC.Task
        name={item.typeName}
        status={this.getTaskStatus(item.status)}
        route={this.props.routes.pcrPrepareItem.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id })}
        validation={validationErrors}
      />
    );
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

const PCRPrepareContainer = (props: ProjectChangeRequestPrepareParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PCRPrepareComponent
          project={stores.projects.getById(props.projectId)}
          pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
          statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
          editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
          onChange={(saving: boolean, dto: PCRDto) => stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, () => stores.navigation.navigateTo(props.routes.pcrsDashboard.getLink({ projectId: props.projectId })))}
          editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareRoute = defineRoute({
  routeName: "pcrPrepare",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare",
  container: PCRPrepareContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
