import { ProjectRole } from "@framework/constants/project";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { BaseProps, defineRoute } from "../../containerBase";
import { usePCRPrepareQuery, FormValues, useOnUpdatePcrPrepare } from "./projectChangeRequestPrepare.logic";
import { useContent } from "@ui/hooks/content.hook";
import { Page } from "@ui/rhf-components/Page";
import { Form } from "@ui/rhf-components/Form";
import { Fieldset } from "@ui/rhf-components/Fieldset";
import { Legend } from "@ui/rhf-components/Legend";
import { BackLink } from "@ui/components/links";
import { Title } from "@ui/components/projects/title";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks, TaskErrors } from "./ProjectChangeRequestOverviewTasks";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { GetItemTaskProps } from "./GetItemTasks";
import { useForm } from "react-hook-form";
import { TextAreaField } from "@ui/rhf-components/groups/TextAreaField";
import { P } from "@ui/rhf-components/Typography";
import { Button, SubmitButton } from "@ui/rhf-components/Button";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { pcrPrepareErrorMap, pcrPrepareSchema } from "./projectChangeRequestPrepare.zod";
import { getPcrItemTaskStatus } from "../utils/getPcrItemTaskStatus";

export interface ProjectChangeRequestPrepareParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const PCRPreparePage = (props: BaseProps & ProjectChangeRequestPrepareParams) => {
  const { project, pcr, statusChanges, editableItemTypes, isMultipleParticipants } = usePCRPrepareQuery(
    props.projectId,
    props.pcrId,
  );

  const pcrItems = pcr.items.map((x, i) => ({
    shortName: x.shortName,
    status: getPcrItemTaskStatus(x.status),
  }));

  const { register, formState, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      comments: "",
      items: pcrItems,
      reasoningStatus: getPcrItemTaskStatus(pcr.reasoningStatus),
    },
    resolver: zodResolver(pcrPrepareSchema, { errorMap: pcrPrepareErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnUpdatePcrPrepare(props.projectId, props.pcrId, pcr, project);

  const { getContent } = useContent();
  const characterCount = watch("comments")?.length ?? 0;

  const validatorErrors = useRhfErrors(formState.errors);

  return (
    <Page
      backLink={
        <BackLink route={props.routes.pcrsDashboard.getLink({ projectId: project.id })}>
          {getContent(x => x.pages.pcrOverview.backToPcrs)}
        </BackLink>
      }
      pageTitle={<Title {...project} />}
      projectStatus={project.status}
      validationErrors={validatorErrors as RhfErrors}
      apiError={apiError}
    >
      <ProjectChangeRequestOverviewSummary pcr={pcr} projectId={project.id} />
      <ProjectChangeRequestOverviewTasks
        pcr={pcr as unknown as Pick<PCRDto, "id" | "reasoningStatus"> & { items: GetItemTaskProps["item"][] }}
        projectId={project.id}
        editableItemTypes={editableItemTypes}
        rhfErrors={validatorErrors as TaskErrors}
        mode="prepare"
      />

      <ProjectChangeRequestOverviewLog statusChanges={statusChanges} />

      <Form
        data-qa="prepare-form"
        onSubmit={handleSubmit(data => onUpdate({ data, context: { saveAndContinue: true } }))}
      >
        <Fieldset>
          <Legend>{getContent(x => x.pages.pcrOverview.addComments)}</Legend>
          <TextAreaField
            id="comments"
            {...register("comments")}
            error={validatorErrors?.comments}
            hint={getContent(x => x.pcrMessages.additionalCommentsGuidance)}
            data-qa="info-text-area"
            characterCount={characterCount}
            disabled={isFetching}
          />
        </Fieldset>
        <Fieldset data-qa="save-buttons">
          {isMultipleParticipants && <P>{getContent(x => x.pcrMessages.submittingGuidance)}</P>}

          <SubmitButton name="button_default" disabled={isFetching}>
            {getContent(x => x.pages.pcrOverview.submitRequest)}
          </SubmitButton>

          <Button
            disabled={isFetching}
            secondary
            name="button_return"
            onClick={() => onUpdate({ data: watch(), context: { saveAndContinue: false } })}
          >
            {getContent(x => x.pages.pcrOverview.saveAndReturn)}
          </Button>
        </Fieldset>
      </Form>
    </Page>
  );
};

export const ProjectChangeRequestPrepareRoute = defineRoute<ProjectChangeRequestPrepareParams>({
  routeName: "pcrPrepare",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare",
  container: PCRPreparePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
