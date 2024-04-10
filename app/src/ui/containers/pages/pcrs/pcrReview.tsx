import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { BaseProps, defineRoute } from "../../containerBase";
import { getPcrItemTaskStatus } from "./utils/getPcrItemTaskStatus";
import { PCRItemType, PCRStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Accordion } from "@ui/components/atomicDesign/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atomicDesign/atoms/Accordion/AccordionItem";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { List } from "@ui/components/atomicDesign/atoms/List/list";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Loader, PageLoader } from "@ui/components/bjss/loading";
import { Logs } from "@ui/components/atomicDesign/molecules/Logs/logs";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { LineBreakList } from "@ui/components/atomicDesign/atoms/LineBreakList/lineBreakList";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { TaskListSection, Task } from "@ui/components/atomicDesign/molecules/TaskList/TaskList";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";

export interface PCRReviewParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

type PcrReviewItem = Pick<PCRItemDto, "shortName" | "typeName" | "type" | "status" | "id">;

type ReviewPcr = Pick<Omit<PCRDto, "items">, "requestNumber" | "reasoningStatus" | "comments" | "status"> & {
  items: PcrReviewItem[];
};

interface Data {
  project: Pick<ProjectDto, "projectNumber" | "title">;
  pcr: ReviewPcr;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  statusChanges: Pending<ProjectChangeRequestStatusChangeDto[]>;
  editableItemTypes: PCRItemType[];
}

interface Callbacks {
  onChange: (save: boolean, dto: ReviewPcr) => void;
}

const Form = createTypedForm<ReviewPcr>();

const PCRReviewComponent = (props: BaseProps & PCRReviewParams & Data & Callbacks) => {
  return (
    <Page
      backLink={
        <BackLink route={props.routes.pcrsDashboard.getLink({ projectId: props.projectId })}>
          Back to project change requests
        </BackLink>
      }
      pageTitle={<Title {...props.project} />}
      validator={props.editor.validator}
      error={props.editor.error}
      projectId={props.projectId}
    >
      <Summary projectChangeRequest={props.pcr} />
      <Tasks
        projectChangeRequest={props.pcr}
        editableItemTypes={props.editableItemTypes}
        editor={props.editor}
        routes={props.routes}
        pcrId={props.pcrId}
        projectId={props.projectId}
      />
      <LogSection statusChanges={props.statusChanges} />
      <ReviewForm editor={props.editor} onChange={props.onChange} />
    </Page>
  );
};

const Summary = ({ projectChangeRequest }: { projectChangeRequest: Data["pcr"] }) => {
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
};

const Tasks = ({
  projectChangeRequest,
  editor,
  editableItemTypes,
  routes,
  pcrId,
  projectId,
}: {
  projectChangeRequest: Data["pcr"];
  editor: IEditorStore<ReviewPcr, PCRDtoValidator>;
  editableItemTypes: PCRItemType[];
  routes: BaseProps["routes"];
  pcrId: PcrId;
  projectId: ProjectId;
}) => {
  return (
    <List qa="taskList">
      <TaskListActions
        projectChangeRequest={projectChangeRequest}
        editableItemTypes={editableItemTypes}
        editor={editor}
        routes={routes}
        projectId={projectId}
        pcrId={pcrId}
      />
      <TaskListReasoning
        projectChangeRequest={projectChangeRequest}
        editableItemTypes={editableItemTypes}
        routes={routes}
        projectId={projectId}
        pcrId={pcrId}
      />
    </List>
  );
};

const TaskListActions = ({
  projectChangeRequest,
  editableItemTypes,
  editor,
  routes,
  projectId,
  pcrId,
}: {
  projectChangeRequest: Data["pcr"];
  editor: IEditorStore<ReviewPcr, PCRDtoValidator>;
  editableItemTypes: PCRItemType[];
  routes: BaseProps["routes"];
  projectId: ProjectId;
  pcrId: PcrId;
}) => {
  if (!editableItemTypes.length) return null;
  const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

  return (
    <TaskListSection step={1} title="Give us information" qa="WhatDoYouWantToDo">
      {editableItems.map((x, i) => (
        <ItemTasks key={x.id} item={x} index={i} editor={editor} routes={routes} projectId={projectId} pcrId={pcrId} />
      ))}
    </TaskListSection>
  );
};

const TaskListReasoning = ({
  projectChangeRequest,
  editableItemTypes,
  routes,
  projectId,
  pcrId,
}: {
  projectChangeRequest: Data["pcr"];
  editableItemTypes: PCRItemType[];
  routes: BaseProps["routes"];
  projectId: ProjectId;
  pcrId: PcrId;
}) => {
  const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
  const stepCount = editableItems.length ? 2 : 1;

  return (
    <TaskListSection step={stepCount} title="Explain why you want to make the changes" qa="reasoning">
      <Task
        name="Reasoning for Innovate UK"
        status={getPcrItemTaskStatus(projectChangeRequest.reasoningStatus)}
        route={routes.pcrReviewReasoning.getLink({
          projectId,
          pcrId,
        })}
      />
    </TaskListSection>
  );
};

const ItemTasks = ({
  item,
  editor,
  index,
  routes,
  projectId,
  pcrId,
}: {
  item: Pick<PCRItemDto, "typeName" | "status" | "id">;
  editor: IEditorStore<ReviewPcr, PCRDtoValidator>;
  index: number;
  routes: BaseProps["routes"];
  projectId: ProjectId;
  pcrId: PcrId;
}) => {
  const validationErrors = editor.validator.items.results[index].errors;

  return (
    <Task
      key={item.typeName}
      name={item.typeName}
      status={getPcrItemTaskStatus(item.status)}
      route={routes.pcrReviewItem.getLink({
        projectId,
        pcrId,
        itemId: item.id,
      })}
      validation={validationErrors}
    />
  );
};

const LogSection = ({ statusChanges }: { statusChanges: Data["statusChanges"] }) => {
  return (
    <Section>
      <Accordion>
        <AccordionItem title="Status and comments log" qa="status-and-comments-log">
          {/* Keeping logs inside loader because accordion defaults to closed*/}
          <Loader
            pending={statusChanges}
            render={statusChanges => <Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" />}
          />
        </AccordionItem>
      </Accordion>
    </Section>
  );
};

const ReviewForm = ({
  editor,
  onChange,
}: {
  editor: IEditorStore<ReviewPcr, PCRDtoValidator>;
  onChange: Callbacks["onChange"];
}) => {
  const options: SelectOption[] = [
    { id: PCRStatus.QueriedByMonitoringOfficer.toString(), value: "Query the request" },
    { id: PCRStatus.SubmittedToInnovateUK.toString(), value: "Send for approval" },
  ];

  const selected = options.find(x => x.id === editor.data.status.toString());

  return (
    <Form.Form
      editor={editor}
      onChange={dto => onChange(false, dto)}
      onSubmit={() => onChange(true, editor.data)}
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
};

const PCRReviewContainer = (props: PCRReviewParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    pcr: stores.projectChangeRequests.getById(props.projectId, props.pcrId),
    editor: stores.projectChangeRequests.getPcrUpdateEditor(
      props.projectId,
      props.pcrId,
      x => (x.status = PCRStatus.Unknown),
    ),
    editableItemTypes: stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId),
  });

  const onChange = (save: boolean, dto: ReviewPcr) =>
    stores.projectChangeRequests.updatePcrEditor({
      saving: save,
      projectId: props.projectId,
      pcrStepType: PCRStepType.spendProfileStep,
      dto: dto as PCRDto,
      onComplete: () => {
        navigate(props.routes.pcrsDashboard.getLink({ projectId: props.projectId }).path);
      },
    });
  return (
    <PageLoader
      pending={combined}
      render={x => (
        <PCRReviewComponent
          onChange={onChange}
          statusChanges={stores.projectChangeRequests.getStatusChanges(props.projectId, props.pcrId)}
          {...x}
          {...props}
        />
      )}
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
