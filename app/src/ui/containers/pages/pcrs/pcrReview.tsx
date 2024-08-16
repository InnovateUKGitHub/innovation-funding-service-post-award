import { PCRDto, PCRItemDto, ProjectChangeRequestStatusChangeDto } from "@framework/dtos/pcrDtos";
import { BaseProps, defineRoute } from "../../containerBase";
import { getPcrItemTaskStatus } from "./utils/getPcrItemTaskStatus";
import { PCRItemType, PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Accordion } from "@ui/components/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atoms/Accordion/AccordionItem";
import { List } from "@ui/components/atoms/List/list";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Logs } from "@ui/components/molecules/Logs/logs";
import { LineBreakList } from "@ui/components/atoms/LineBreakList/lineBreakList";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { TaskListSection, Task } from "@ui/components/molecules/TaskList/TaskList";
import { useOnUpdatePcrReview, usePcrReviewQuery } from "./pcrReview.logic";
import { PcrItemDtoMapping } from "@gql/dtoMapper/mapPcrDto";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { useForm } from "react-hook-form";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { TextAreaField } from "@ui/components/molecules/form/TextFieldArea/TextAreaField";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { PcrReviewSchemaType, pcrReviewErrorMap, pcrReviewSchema } from "./pcrReview.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { getDisplayName } from "./pcrItemWorkflow.logic";
import { H2 } from "@ui/components/atoms/Heading/Heading.variants";

export interface PCRReviewParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

type PcrReviewItem = Pick<PcrItemDtoMapping, "shortName" | "typeName" | "type" | "status" | "id">;

type ReviewPcr = Pick<Omit<PCRDto, "items">, "requestNumber" | "reasoningStatus" | "comments" | "status"> & {
  items: PcrReviewItem[];
};

interface Data {
  project: Pick<ProjectDto, "projectNumber" | "title">;
  pcr: ReviewPcr;
  statusChanges: Omit<ProjectChangeRequestStatusChangeDto, "previousStatusLabel" | "projectChangeRequest">[];
  editableItemTypes: PCRItemType[];
}

const PCRReviewComponent = (props: BaseProps & PCRReviewParams) => {
  const { pcr, fragmentRef, statusChanges, editableItemTypes } = usePcrReviewQuery(props.projectId, props.pcrId);

  const { getContent } = useContent();

  const { register, watch, formState, handleSubmit } = useForm<PcrReviewSchemaType>({
    defaultValues: { comments: "", status: "" },
    resolver: zodResolver(pcrReviewSchema, {
      errorMap: pcrReviewErrorMap,
    }),
  });

  const { isFetching, apiError, onUpdate } = useOnUpdatePcrReview(props.pcrId, props.projectId, pcr);

  const validationErrors = useRhfErrors(formState.errors);

  return (
    <Page
      backLink={
        <BackLink route={props.routes.pcrsDashboard.getLink({ projectId: props.projectId })}>
          {getContent(x => x.pages.pcrReview.backLink)}
        </BackLink>
      }
      validationErrors={validationErrors}
      fragmentRef={fragmentRef}
      apiError={apiError}
    >
      <Summary projectChangeRequest={pcr} />
      <Tasks
        projectChangeRequest={pcr}
        editableItemTypes={editableItemTypes}
        routes={props.routes}
        pcrId={props.pcrId}
        projectId={props.projectId}
      />
      <LogSection statusChanges={statusChanges} />

      <Form onSubmit={handleSubmit(data => onUpdate({ data }))}>
        <Fieldset>
          <H2>{getContent(x => x.pages.pcrReview.statusTitle)}</H2>

          <FormGroup>
            <ValidationError error={validationErrors?.status as RhfError} />
            <RadioList name="status" register={register}>
              <Radio
                id={PCRStatus.QueriedByMonitoringOfficer.toString()}
                label={getContent(x => x.pages.pcrReview.queryStatus)}
                disabled={isFetching}
              />
              <Radio
                id={PCRStatus.SubmittedToInnovateUK.toString()}
                label={getContent(x => x.pages.pcrReview.approveStatus)}
                disabled={isFetching}
              />
            </RadioList>
          </FormGroup>
        </Fieldset>

        <TextAreaField
          {...register("comments")}
          id="comments"
          label={getContent(x => x.pages.pcrReview.addCommentsLabel)}
          boldLabel
          characterCount={watch("comments")?.length ?? 0}
          characterCountType="descending"
          disabled={isFetching}
          error={validationErrors?.comments as RhfError}
        />

        <Fieldset>
          <Button type="submit" disabled={isFetching}>
            {getContent(x => x.pages.pcrReview.submit)}
          </Button>
        </Fieldset>
      </Form>
    </Page>
  );
};

const Summary = ({
  projectChangeRequest,
}: {
  projectChangeRequest: Pick<Data["pcr"], "requestNumber"> & { items: Pick<PcrReviewItem, "shortName">[] };
}) => {
  return (
    <Section title="Details">
      <SummaryList qa="pcrDetails">
        <SummaryListItem label="Request number" content={projectChangeRequest.requestNumber} qa="numberRow" />
        <SummaryListItem
          label="Types"
          content={<LineBreakList items={projectChangeRequest.items.map(x => getDisplayName(x.shortName))} />}
          qa="typesRow"
        />
      </SummaryList>
    </Section>
  );
};

const Tasks = ({
  projectChangeRequest,
  editableItemTypes,
  routes,
  pcrId,
  projectId,
}: {
  projectChangeRequest: Pick<Data["pcr"], "reasoningStatus"> & {
    items: Pick<PcrReviewItem, "type" | "id" | "status" | "typeName">[];
  };
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
  routes,
  projectId,
  pcrId,
}: {
  projectChangeRequest: { items: Pick<PcrReviewItem, "type" | "id" | "status" | "typeName">[] };
  editableItemTypes: PCRItemType[];
  routes: BaseProps["routes"];
  projectId: ProjectId;
  pcrId: PcrId;
}) => {
  if (!editableItemTypes.length) return null;
  const editableItems = projectChangeRequest.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
  return (
    <TaskListSection step={1} title="Give us information" qa="WhatDoYouWantToDo">
      {editableItems.map(x => (
        <ItemTasks key={x.id} item={x} routes={routes} projectId={projectId} pcrId={pcrId} />
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
  projectChangeRequest: Pick<Data["pcr"], "reasoningStatus"> & { items: Pick<PcrReviewItem, "type">[] };
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
  routes,
  projectId,
  pcrId,
}: {
  item: Pick<PCRItemDto, "typeName" | "status" | "id">;
  routes: BaseProps["routes"];
  projectId: ProjectId;
  pcrId: PcrId;
}) => {
  return (
    <Task
      key={item.typeName}
      name={getDisplayName(item.typeName)}
      status={getPcrItemTaskStatus(item.status)}
      route={routes.pcrReviewItem.getLink({
        projectId,
        pcrId,
        itemId: item.id,
      })}
    />
  );
};

const LogSection = ({ statusChanges }: { statusChanges: Data["statusChanges"] }) => {
  return (
    <Section>
      <Accordion>
        <AccordionItem title="Status and comments log" qa="status-and-comments-log">
          <Logs data={statusChanges} qa="projectChangeRequestStatusChangeTable" />
        </AccordionItem>
      </Accordion>
    </Section>
  );
};

export const PCRReviewRoute = defineRoute({
  routeName: "pcrReview",
  routePath: "/projects/:projectId/pcrs/:pcrId/review",
  container: PCRReviewComponent,
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
