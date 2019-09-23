import React from "react";

import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { Pending } from "@shared/pending";
import { PCRsDashboardRoute } from "./dashboard";
import { ProjectChangeRequestPrepareItemRoute } from "./prepareItem";
import { ProjectChangeRequestPrepareReasoningRoute } from "./prepareReasoning";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ProjectChangeRequestStatus } from "@framework/entities";
import { navigateTo } from "../../redux/actions";
import { Link } from "../../components";
import { ProjectChangeRequestAddTypeRoute } from "@ui/containers";
import { Task, TaskList, TaskListSection } from "@ui/components/taskList";

export interface ProjectChangeRequestPrepareParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
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

  private renderContents(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const Form = ACC.TypedForm<PCRDto>();

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRsDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to project change requests</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section title="Details">
          <ACC.SummaryList qa="pcr-prepare">
            <ACC.SummaryListItem label="Number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={this.renderTypes(pcr)} action={<Link route={ProjectChangeRequestAddTypeRoute.getLink({ projectId: this.props.projectId, projectChangeRequestId: this.props.pcrId })}>Add Type</Link>} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        <TaskList>
          {pcr.items.map((x, i) => (
            <TaskListSection step={i + 1} title={x.typeName} validation={editor.validator.items.results[i].errors}>
              <Task
                name="Provide your files"
                status={x.statusName}
                route={ProjectChangeRequestPrepareItemRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId, itemId: x.id })}
              />
            </TaskListSection>
          ))}
          <TaskListSection step={pcr.items.length + 1} title={"Give more details"} validation={[editor.validator.reasoningStatus, editor.validator.reasoningComments]}>
            <Task
              name="Reasoning for Innovate UK"
              status={pcr.reasoningStatusName}
              route={ProjectChangeRequestPrepareReasoningRoute.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}
            />
          </TaskListSection>
        </TaskList>

        <Form.Form
          editor={editor}
          onChange={dto => this.props.onChange(pcr.projectId, pcr.id, dto)}
          onSubmit={() => this.onSave(editor, pcr, true)}
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
            <Form.Button name="return" onClick={() => this.onSave(editor, pcr, false)}>Save and return to project</Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </ACC.Page>
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
    editor: Selectors.getPcrEditor(params.projectId, params.pcrId).get(state)
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
    Actions.loadPcrTypes()
  ],
  getTitle: () => ({
    htmlTitle: "Prepare project change request",
    displayTitle: "Prepare project change request"
  }),
  container: PCRPrepare,
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
