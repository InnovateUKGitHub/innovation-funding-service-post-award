import { PCRDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { PCRItemDto, PCRItemStatus, PCRItemType, PCRStatus, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "@shared/pending";
import * as ACC from "@ui/components";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { ProjectParticipantsHoc } from "@ui/features/project-participants";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { useNavigate } from "react-router-dom";

import { IRoutes } from "@ui/routing";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { usePcrItemName } from "./utils/getPcrItemName";
import { getPcrItemTaskStatus } from "./utils/getPcrItemTaskStatus";

export interface ProjectChangeRequestPrepareParams {
  projectId: ProjectId;
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

const Form = ACC.createTypedForm<PCRDto>();

class PCRPrepareComponent extends ContainerBase<ProjectChangeRequestPrepareParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editor: this.props.editor,
      editableItemTypes: this.props.editableItemTypes,
    });

    return (
      <ACC.PageLoader
        pending={combined}
        render={x => this.renderContents(x.project, x.pcr, x.editor, x.editableItemTypes)}
      />
    );
  }

  private onSave(editor: IEditorStore<PCRDto, PCRDtoValidator>, original: PCRDto, submit: boolean) {
    const dto = editor.data;
    if (submit && original.status === PCRStatus.QueriedByInnovateUK) {
      dto.status = PCRStatus.SubmittedToInnovateUK;
    } else if (submit) {
      dto.status = PCRStatus.SubmittedToMonitoringOfficer;
    } else {
      // not submitting so set status to the original status
      dto.status = original.status;
    }
    this.props.onChange(true, dto);
  }

  private renderContents(
    project: ProjectDto,
    projectChangeRequest: PCRDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>
            Back to project change requests
          </ACC.BackLink>
        }
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        {this.renderSummary(projectChangeRequest)}
        {this.renderTasks(projectChangeRequest, editor, editableItemTypes)}
        {this.renderLog()}
        {this.renderForm(projectChangeRequest, editor)}
      </ACC.Page>
    );
  }

  private renderSummary(projectChangeRequest: PCRDto) {
    return (
      <ACC.Section title="Details">
        <ACC.SummaryList qa="pcr-prepare">
          <ACC.SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
          <ACC.SummaryListItem
            label="Types"
            content={<ACC.Renderers.LineBreakList items={projectChangeRequest.items.map(x => x.shortName)} />}
            action={
              <ACC.Link
                route={this.props.routes.projectChangeRequestAddType.getLink({
                  projectId: this.props.projectId,
                  projectChangeRequestId: this.props.pcrId,
                })}
              >
                Add types
              </ACC.Link>
            }
            qa="typesRow"
          />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderTasks(
    projectChangeRequest: PCRDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    return (
      <ACC.List qa="taskList">
        {this.renderTaskListActions(projectChangeRequest, editor, editableItemTypes)}
        {this.renderTaskListReasoning(projectChangeRequest, editor, editableItemTypes)}
      </ACC.List>
    );
  }

  private renderForm(projectChangeRequest: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    return (
      <Form.Form
        editor={editor}
        onChange={dto => this.props.onChange(false, dto)}
        onSubmit={() => this.onSave(editor, projectChangeRequest, true)}
        qa="prepare-form"
      >
        <Form.Fieldset heading="Add comments">
          <Form.MultilineString
            name="comments"
            hint="If you want to explain anything to your monitoring officer or to Innovate UK, add it here."
            value={x => x.comments}
            update={(m, v) => (m.comments = v || "")}
            validation={editor.validator.comments}
            characterCountOptions={{ type: "descending", maxValue: PCRDtoValidator.maxCommentsLength }}
            qa="info-text-area"
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-buttons">
          <ProjectParticipantsHoc>
            {x =>
              x.isMultipleParticipants && (
                <ACC.Renderers.SimpleString>
                  By submitting this request, you confirm that all project partners have approved these changes.
                </ACC.Renderers.SimpleString>
              )
            }
          </ProjectParticipantsHoc>

          <Form.Submit>Submit request</Form.Submit>
          <Form.Button name="return" onClick={() => this.onSave(editor, projectChangeRequest, false)}>
            Save and return to requests
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    );
  }

  private renderTaskListActions(
    projectChangeRequest: PCRDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    if (!editableItemTypes.length) return null;
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

    return (
      <ACC.TaskListSection step={1} title="Give us information" qa="WhatDoYouWantToDo">
        {editableItems.map((x, i) => (
          <GetItemTasks
            item={x}
            editor={editor}
            index={i}
            pcrId={this.props.pcrId}
            projectId={this.props.projectId}
            routes={this.props.routes}
            key={i}
          />
        ))}
      </ACC.TaskListSection>
    );
  }

  private renderTaskListReasoning(
    projectChangeRequest: PCRDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
    const stepCount = editableItems.length ? 2 : 1;

    const route = this.props.routes.pcrPrepareReasoning.getLink({
      projectId: this.props.projectId,
      pcrId: this.props.pcrId,
      step: projectChangeRequest.reasoningStatus === PCRItemStatus.ToDo ? 1 : undefined,
    });

    return (
      <ACC.TaskListSection step={stepCount} title="Explain why you want to make the changes" qa="reasoning">
        <ACC.Task
          name={x => x.taskList.provideReasoning}
          status={getPcrItemTaskStatus(projectChangeRequest.reasoningStatus)}
          route={route}
          validation={[editor.validator.reasoningStatus, editor.validator.reasoningComments]}
        />
      </ACC.TaskListSection>
    );
  }

  private renderLog() {
    return (
      <ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem title="Status and comments log" qa="status-and-comments-log">
            {/* Keeping logs inside loader because accordion defaults to closed*/}
            <ACC.Loader
              pending={this.props.statusChanges}
              render={statusChanges => <ACC.Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" />}
            />
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Section>
    );
  }
}

const PCRPrepareContainer = (props: ProjectChangeRequestPrepareParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  return (
    <PCRPrepareComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
      statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
      editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
      onChange={(saving: boolean, dto: PCRDto) =>
        stores.projectChangeRequests.updatePcrEditor(saving, props.projectId, dto, undefined, () =>
          navigate(props.routes.pcrsDashboard.getLink({ projectId: props.projectId }).path),
        )
      }
      editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
    />
  );
};

const GetItemTasks = ({
  editor,
  index,
  item,
  routes,
  projectId,
  pcrId,
}: {
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  index: number;
  item: PCRItemDto;
  routes: IRoutes;
  projectId: ProjectId;
  pcrId: string;
}) => {
  const validationErrors = editor.validator.items.results[index].errors;
  const workflow = PcrWorkflow.getWorkflow(item, 1);
  const { getPcrItemContent } = usePcrItemName();

  return (
    <ACC.Task
      name={getPcrItemContent(item.typeName, item).label}
      status={getPcrItemTaskStatus(item.status)}
      route={routes.pcrPrepareItem.getLink({
        projectId: projectId,
        pcrId: pcrId,
        itemId: item.id,
        step: item.status === PCRItemStatus.ToDo && workflow && workflow.getCurrentStepInfo() ? 1 : undefined,
      })}
      validation={validationErrors}
    />
  );
};

export const ProjectChangeRequestPrepareRoute = defineRoute({
  routeName: "pcrPrepare",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare",
  container: PCRPrepareContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
