import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { PCRReviewItemRoute } from "./viewItem";
import { PCRReviewReasoningRoute } from "./viewReasoning";
import { PCRDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestStatus } from "@framework/entities";
import { navigateTo } from "../../redux/actions";
import { Task, TaskList, TaskListSection } from "@ui/components/taskList";

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
  onChange: (projectId: string, pcrId: string, dto: PCRDto) => void;
  onSave: (projectId: string, pcrId: string, dto: PCRDto) => void;
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
        <TaskList qa="taskList">
          {projectChangeRequest.items.map((x, i) => (
            <TaskListSection step={i + 1} title={x.typeName} qa={`task-${i}`}>
              <Task
                name="View files"
                status={this.getTaskStatus(x.status)}
                route={PCRReviewItemRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: x.id })}
              />
            </TaskListSection>
          ))}
          <TaskListSection step={projectChangeRequest.items.length + 1} title={"View more details"} qa="reasoning">
            <Task
              name="Reasoning for Innovate UK"
              status={this.getTaskStatus(projectChangeRequest.reasoningStatus)}
              route={PCRReviewReasoningRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
            />
          </TaskListSection>
        </TaskList>
        <Form.Form
          editor={editor}
          onChange={dto => this.props.onChange(projectChangeRequest.projectId, projectChangeRequest.id, dto)}
          onSubmit={() => this.props.onSave(projectChangeRequest.projectId, projectChangeRequest.id, editor.data)}
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

  getTaskStatus(status: ProjectChangeRequestItemStatus): "To do" | "Complete" | "Incomplete" {
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

const definition = ReduxContainer.for<PCRReviewParams, Data, Callbacks>(PCRReviewComponent);

export const PCRReview = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    // initalise editor pcr status to unknown to force state selection via form
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state, x => x.status = ProjectChangeRequestStatus.Unknown),
    statusChanges: Selectors.getProjectChangeRequestStatusChanges(params.pcrId).getPending(state)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(navigateTo(PCRsDashboardRoute.getLink({ projectId })))))
  })
});

export const PCRReviewRoute = definition.route({
  routeName: "pcrReview",
  routePath: "/projects/:projectId/pcrs/:pcrId/review",
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.pcrId),
    Actions.loadPcrTypes(),
    Actions.loadProjectChangeRequestStatusChanges(params.projectId, params.pcrId)
  ],
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request"
  }),
  container: PCRReview,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer)
});
