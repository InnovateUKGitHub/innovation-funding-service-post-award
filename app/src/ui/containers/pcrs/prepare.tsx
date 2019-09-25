import React, { ReactNode } from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { PCRItemDto, ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Link } from "../../components";
import * as Actions from "../../redux/actions";
import { navigateTo } from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { ProjectChangeRequestPrepareItemRoute } from "./prepareItem";
import { ProjectChangeRequestPrepareReasoningRoute } from "./prepareReasoning";
import { PCRDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStatus } from "@framework/entities";
import { ProjectChangeRequestAddTypeRoute, ProjectChangeRequestPrepareItemForTimeExtensionRoute } from "@ui/containers";
import { Task, TaskList, TaskListSection } from "@ui/components/taskList";

export interface ProjectChangeRequestPrepareParams {
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

class PCRPrepareComponent extends ContainerBase<ProjectChangeRequestPrepareParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({ project: this.props.project, pcr: this.props.pcr, editor: this.props.editor });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor)} />;
  }

  private onSave(editor: IEditorStore<PCRDto, PCRDtoValidator>, original: PCRDto, submit: boolean) {
    if (submit && original.status === ProjectChangeRequestStatus.QueriedByInnovateUK) {
      editor.data.status = ProjectChangeRequestStatus.SubmittedToInnovationLead;
    }
    else if (submit) {
      editor.data.status = ProjectChangeRequestStatus.SubmittedToMonitoringOfficer;
    }
    else {
      // not submitting so set status to the original status
      editor.data.status = original.status;
    }
    this.props.onSave(this.props.projectId, this.props.pcrId, editor.data);
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

  private getItemTasks(item: PCRItemDto) {
    // tslint:disable:no-small-switch TODO remove this when more added
    switch (item.type) {
      case ProjectChangeRequestItemTypeEntity.TimeExtension:
        return (
          <Task
            name="Set new end date for project"
            status={item.statusName}
            route={ProjectChangeRequestPrepareItemForTimeExtensionRoute.getLink({projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id })}
          />
        );
      default:
        return (
          <Task
            name="Provide your files"
            status={item.statusName}
            route={ProjectChangeRequestPrepareItemRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: item.id })}
          />
        );
    }
  }

  private renderDetailsTab(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const Form = ACC.TypedForm<PCRDto>();
    return (
      <React.Fragment>
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr-prepare">
            <ACC.SummaryListItem label="Number" content={projectChangeRequest.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(projectChangeRequest)} action={<Link route={ProjectChangeRequestAddTypeRoute.getLink({ projectId: this.props.projectId, projectChangeRequestId: this.props.pcrId })}>Add Type</Link>} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        <TaskList qa="taskList">
          {projectChangeRequest.items.map((x, i) => {
            return (
              <TaskListSection key={i} step={i + 1} title={x.typeName} validation={editor.validator.items.results[i].errors} qa={`task-${i}`}>
                { this.getItemTasks(x)}
              </TaskListSection>
            );
          })}
          <TaskListSection step={projectChangeRequest.items.length + 1} title={"Give more details"} validation={[editor.validator.reasoningStatus, editor.validator.reasoningComments]} qa="reasoning">
            <Task
              name="Reasoning for Innovate UK"
              status={projectChangeRequest.reasoningStatusName}
              route={ProjectChangeRequestPrepareReasoningRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
            />
          </TaskListSection>
        </TaskList>
        <Form.Form
          editor={editor}
          onChange={dto => this.props.onChange(projectChangeRequest.projectId, projectChangeRequest.id, dto)}
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
            <Form.Button name="return" onClick={() => this.onSave(editor, projectChangeRequest, false)}>Save and return to project</Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </React.Fragment>
    );
  }

  private renderLogTab() {
    return (
      <ACC.Loader
        pending={this.props.statusChanges}
        render={(statusChanges) => <ACC.Section title="Log"><ACC.Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" /></ACC.Section>}
      />
    );
  }

  private renderTypes(pcr: PCRDto): React.ReactNode {
    return pcr.items.map(x => x.typeName).reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    }, []);
  }

}

const definition = ReduxContainer.for<ProjectChangeRequestPrepareParams, Data, Callbacks>(PCRPrepareComponent);

export const PCRPrepare = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
    pcr: Selectors.getPcr(params.projectId, params.pcrId).getPending(state),
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state),
    statusChanges: Selectors.getProjectChangeRequestStatusChanges(params.pcrId).getPending(state)
  }),
  withCallbacks: (dispatch) => ({
    onChange: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.validatePCR(projectId, pcrId, dto)),
    onSave: (projectId: string, pcrId: string, dto: PCRDto) => dispatch(Actions.savePCR(projectId, pcrId, dto, () => dispatch(navigateTo(PCRsDashboardRoute.getLink({ projectId })))))
  })
});

export const ProjectChangeRequestPrepareRoute = definition.route({
  routeName: "pcrPrepare",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare",
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
    htmlTitle: "Prepare project change request",
    displayTitle: "Prepare project change request"
  }),
  container: PCRPrepare,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
