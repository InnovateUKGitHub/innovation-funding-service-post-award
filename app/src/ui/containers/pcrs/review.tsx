import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import {
  PCRItemStatus,
  PCRItemType,
  PCRStatus
} from "@framework/constants";

export interface PCRReviewParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  statusChanges: Pending<ProjectChangeRequestStatusChangeDto[]>;
  editableItemTypes: Pending<PCRItemType[]>;
}

interface Callbacks {
  onChange: (save: boolean, dto: PCRDto) => void;
}

class PCRReviewComponent extends ContainerBase<PCRReviewParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editor: this.props.editor, editableItemTypes: this.props.editableItemTypes });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor, x.editableItemTypes)} />;
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: PCRItemType[]) {
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

  private renderDetailsTab(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: PCRItemType[]) {
    const Form = ACC.TypedForm<PCRDto>();

    const options: ACC.SelectOption[] = [
      { id: PCRStatus.QueriedByMonitoringOfficer.toString(), value: "Query the request" },
      { id: PCRStatus.SubmittedToInnovationLead.toString(), value: "Send for approval" },
    ];

    const selected = options.find(x => x.id === editor.data.status.toString());
    return (
      <React.Fragment>
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcrDetails">
            <ACC.SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={projectChangeRequest.items.map(x => x.typeName)} />} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.TaskList qa="taskList">
          {this.renderTaskListActions(projectChangeRequest, editor, editableItemTypes)}
          {this.renderTaskListReasoning(projectChangeRequest, editableItemTypes)}
        </ACC.TaskList>
        <Form.Form
          editor={editor}
          onChange={dto => this.props.onChange(false, dto)}
          onSubmit={() => this.props.onChange(true, editor.data)}
          qa="pcr-review-form"
        >
          <Form.Fieldset heading="How do you want to proceed?">
            <Form.Radio
              name="status"
              inline={false}
              options={options}
              value={x => selected}
              update={(m, v) => m.status = parseInt(v && v.id || "", 10) || PCRStatus.Unknown}
              validation={editor.validator.status}
            />
          </Form.Fieldset>
          <Form.Fieldset heading="Add your comments" isSubQuestion={true}>
            <Form.MultilineString
              name="comments"
              label=""
              hint="If you query the request, you must explain what the partner needs to amend. If you are sending it to Innovate UK, you must say whether you approve of the request, giving a reason why."
              value={m => m.comments}
              update={(m, v) => m.comments = (v || "")}
              validation={editor.validator.comments}
            />
          </Form.Fieldset>
          <Form.Fieldset qa="save-and-submit">
            <Form.Submit>Submit</Form.Submit>
          </Form.Fieldset>
        </Form.Form>
      </React.Fragment>
    );
  }

  private renderTaskListActions(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, editableItemTypes: PCRItemType[]) {
    if (!editableItemTypes.length) return null;
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

    return (
      <ACC.TaskListSection step={1} title="What do you want to do?" qa="WhatDoYouWantToDo">
        {editableItems.map((x, i) => this.getItemTasks(x, editor, i))}
      </ACC.TaskListSection>
    );
  }

  private renderTaskListReasoning(projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
    const stepCount = editableItems.length ? 2 : 1;

    return (
      <ACC.TaskListSection step={stepCount} title="View more details" qa="reasoning">
        <ACC.Task
          name="Reasoning for Innovate UK"
          status={this.getTaskStatus(projectChangeRequest.reasoningStatus)}
          route={this.props.routes.pcrReviewReasoning.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
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
        route={this.props.routes.pcrReviewItem.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id })}
        validation={validationErrors}
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

const PCRReviewContainer = (props: PCRReviewParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRReviewComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
        // initalise editor pcr status to unknown to force state selection via form
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, x => x.status = PCRStatus.Unknown)}
        onChange={(save, dto) => stores.projectChangeRequests.updatePcrEditor(save, props.projectId, dto, undefined, () => stores.navigation.navigateTo(props.routes.pcrsDashboard.getLink({ projectId: props.projectId })))}
        editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const PCRReviewRoute = defineRoute({
  routeName: "pcrReview",
  routePath: "/projects/:projectId/pcrs/:pcrId/review",
  container: PCRReviewContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
