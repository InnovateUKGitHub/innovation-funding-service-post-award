import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { getPcrItemTaskStatus } from "./utils/getPcrItemTaskStatus";
import { PCRItemType, PCRStatus, PCRStepId } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Accordion } from "@ui/components/accordion/Accordion";
import { AccordionItem } from "@ui/components/accordion/AccordionItem";
import { createTypedForm, SelectOption } from "@ui/components/form";
import { List } from "@ui/components/layout/list";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { Loader, PageLoader } from "@ui/components/loading";
import { Logs } from "@ui/components/logs";
import { Title } from "@ui/components/projects/title";
import { LineBreakList } from "@ui/components/renderers/lineBreakList";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { TaskListSection, Task } from "@ui/components/taskList";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";

export interface PCRReviewParams {
  projectId: ProjectId;
  pcrId: PcrId;
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

const Form = createTypedForm<PCRDto>();

class PCRReviewComponent extends ContainerBase<PCRReviewParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editor: this.props.editor,
      editableItemTypes: this.props.editableItemTypes,
    });

    return (
      <PageLoader
        pending={combined}
        render={x => this.renderContents(x.project, x.pcr, x.editor, x.editableItemTypes)}
      />
    );
  }

  private renderContents(
    project: ProjectDto,
    projectChangeRequest: PCRDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    return (
      <Page
        backLink={
          <BackLink route={this.props.routes.pcrsDashboard.getLink({ projectId: this.props.projectId })}>
            Back to project change requests
          </BackLink>
        }
        pageTitle={<Title {...project} />}
        project={project}
        validator={editor.validator}
        error={editor.error}
      >
        {this.renderSummary(projectChangeRequest)}
        {this.renderTasks(projectChangeRequest, editor, editableItemTypes)}
        {this.renderLog()}
        {this.renderForm(editor)}
      </Page>
    );
  }

  private renderSummary(projectChangeRequest: PCRDto) {
    return (
      <Section title="Details">
        <SummaryList qa="pcrDetails">
          <SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
          <SummaryListItem
            label="Types"
            content={<LineBreakList items={projectChangeRequest.items.map(x => x.shortName)} />}
            qa="typesRow"
          />
        </SummaryList>
      </Section>
    );
  }

  private renderTasks(
    projectChangeRequest: PCRDto,
    editor: IEditorStore<PCRDto, PCRDtoValidator>,
    editableItemTypes: PCRItemType[],
  ) {
    return (
      <List qa="taskList">
        {this.renderTaskListActions(projectChangeRequest, editor, editableItemTypes)}
        {this.renderTaskListReasoning(projectChangeRequest, editableItemTypes)}
      </List>
    );
  }

  private renderForm(editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const options: SelectOption[] = [
      { id: PCRStatus.QueriedByMonitoringOfficer.toString(), value: "Query the request" },
      { id: PCRStatus.SubmittedToInnovateUK.toString(), value: "Send for approval" },
    ];

    const selected = options.find(x => x.id === editor.data.status.toString());

    return (
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
            value={() => selected}
            update={(m, v) => (m.status = parseInt((v && v.id) || "", 10) || PCRStatus.Unknown)}
            validation={editor.validator.status}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Add your comments" isSubQuestion>
          <Form.MultilineString
            name="comments"
            label=""
            hint="If you query the request, you must explain what the partner needs to amend. If you are sending it to Innovate UK, you must say whether you approve of the request, giving a reason why."
            value={m => m.comments}
            update={(m, v) => (m.comments = v || "")}
            validation={editor.validator.comments}
            characterCountOptions={{ type: "descending", maxValue: PCRDtoValidator.maxCommentsLength }}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-submit">
          <Form.Submit>Submit</Form.Submit>
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
      <TaskListSection step={1} title="Give us information" qa="WhatDoYouWantToDo">
        {editableItems.map((x, i) => this.getItemTasks(x, editor, i))}
      </TaskListSection>
    );
  }

  private renderTaskListReasoning(projectChangeRequest: PCRDto, editableItemTypes: PCRItemType[]) {
    const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
    const stepCount = editableItems.length ? 2 : 1;

    return (
      <TaskListSection step={stepCount} title="Explain why you want to make the changes" qa="reasoning">
        <Task
          name="Reasoning for Innovate UK"
          status={getPcrItemTaskStatus(projectChangeRequest.reasoningStatus)}
          route={this.props.routes.pcrReviewReasoning.getLink({
            projectId: this.props.projectId,
            pcrId: this.props.pcrId,
          })}
        />
      </TaskListSection>
    );
  }
  private getItemTasks(item: PCRItemDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, index: number) {
    const validationErrors = editor.validator.items.results[index].errors;

    return (
      <Task
        key={item.typeName}
        name={item.typeName}
        status={getPcrItemTaskStatus(item.status)}
        route={this.props.routes.pcrReviewItem.getLink({
          projectId: this.props.projectId,
          pcrId: this.props.pcrId,
          itemId: item.id,
        })}
        validation={validationErrors}
      />
    );
  }

  private renderLog() {
    return (
      <Section>
        <Accordion>
          <AccordionItem title="Status and comments log" qa="status-and-comments-log">
            {/* Keeping logs inside loader because accordion defaults to closed*/}
            <Loader
              pending={this.props.statusChanges}
              render={statusChanges => <Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" />}
            />
          </AccordionItem>
        </Accordion>
      </Section>
    );
  }
}

const PCRReviewContainer = (props: PCRReviewParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  return (
    <PCRReviewComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
      statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
      // initalise editor pcr status to unknown to force state selection via form
      editor={stores.projectChangeRequests.getPcrUpdateEditor(
        props.projectId,
        props.pcrId,
        x => (x.status = PCRStatus.Unknown),
      )}
      onChange={(save, dto) =>
        stores.projectChangeRequests.updatePcrEditor({
          saving: save,
          projectId: props.projectId,
          pcrStepId: PCRStepId.spendProfileStep,
          dto,
          onComplete: () => {
            navigate(props.routes.pcrsDashboard.getLink({ projectId: props.projectId }).path);
          },
        })
      }
      editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
    />
  );
};

export const PCRReviewRoute = defineRoute({
  routeName: "pcrReview",
  routePath: "/projects/:projectId/pcrs/:pcrId/review",
  container: PCRReviewContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
});
