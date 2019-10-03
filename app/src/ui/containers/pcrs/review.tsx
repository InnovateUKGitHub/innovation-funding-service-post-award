import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRReviewItemRoute } from "./viewItem";
import { PCRReviewReasoningRoute } from "./viewReasoning";
import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStatus } from "@framework/entities";

export interface PCRReviewParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  statusChanges: Pending<ProjectChangeRequestStatusChangeDto[]>;
}

interface Callbacks {
  onChange: (save: boolean, dto: PCRDto) => void;
}

class PCRReviewComponent extends ContainerBase<PCRReviewParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editor: this.props.editor });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor)} />;
  }

  private renderContents(project: ProjectDto, projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const tabs = [{
      text: "Details",
      hash: "details",
      default: true,
      content: this.renderDetailsTab(projectChangeRequest, editor),
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
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.HashTabs tabList={tabs} />
      </ACC.Page>
    );
  }

  private renderDetailsTab(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const Form = ACC.TypedForm<PCRDto>();

    const options: ACC.SelectOption[] = [
      { id: ProjectChangeRequestStatus.QueriedByMonitoringOfficer.toString(), value: "Query with project manager" },
      { id: ProjectChangeRequestStatus.SubmittedToInnovationLead.toString(), value: "Send to Innovate UK for approval" },
    ];

    const selected = options.find(x => x.id === editor.data.status.toString());
    return (
      <React.Fragment>
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcrDetails">
            <ACC.SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={projectChangeRequest.items.map(x => x.typeName)}/>} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>
        <ACC.TaskList qa="taskList">
          <ACC.TaskListSection step={1} title="What do you want to do?" qa="WhatDoYouWantToDo">
            {projectChangeRequest.items.map((x, i) => this.getItemTasks(x, editor, i))}
          </ACC.TaskListSection>
          <ACC.TaskListSection step={2} title="View more details" qa="reasoning">
            <ACC.Task
              name="Reasoning for Innovate UK"
              status={this.getTaskStatus(projectChangeRequest.reasoningStatus)}
              route={PCRReviewReasoningRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
            />
          </ACC.TaskListSection>
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
              update={(m, v) => m.status = parseInt(v && v.id || "", 10) || ProjectChangeRequestStatus.Unknown}
              validation={editor.validator.status}
            />
            <Form.MultilineString
              name="comments"
              label="Add your comments"
              hint="If you query the request, you must explain what the partner needs to amend. If you are sending it to Innovate UK, you must say that you recommend the request for approval and why."
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

  private getItemTasks(item: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, index: number) {
    const validationErrors = editor.validator.items.results[index].errors;
    return (
      <ACC.Task
        name={item.typeName}
        status={this.getTaskStatus(item.status)}
        route={PCRReviewItemRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id })}
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

const PCRReviewContainer = (props: PCRReviewParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRReviewComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
        // initalise editor pcr status to unknown to force state selection via form
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId, x => x.status = ProjectChangeRequestStatus.Unknown)}
        onChange={(save, dto) => stores.projectChangeRequests.updatePcrEditor(save, props.projectId, dto, undefined, () => stores.navigation.navigateTo(PCRsDashboardRoute.getLink({ projectId: props.projectId })))}
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
