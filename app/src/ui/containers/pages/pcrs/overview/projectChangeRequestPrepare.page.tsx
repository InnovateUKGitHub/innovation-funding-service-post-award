import { ProjectRole } from "@framework/constants/project";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { useContent } from "@ui/hooks/content.hook";
import { useForm } from "react-hook-form";
import { BaseProps, defineRoute } from "../../../containerBase";
import { getPcrItemTaskStatus } from "../utils/getPcrItemTaskStatus";
import { GetItemTaskProps } from "./GetItemTasks";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks, TaskErrors } from "./ProjectChangeRequestOverviewTasks";
import { FormValues, useOnUpdatePcrPrepare, usePCRPrepareQuery } from "./projectChangeRequestPrepare.logic";
import { pcrPrepareErrorMap, pcrPrepareSchema } from "./projectChangeRequestPrepare.zod";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { createRegisterButton } from "@framework/util/registerButton";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
import { mapToSalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import { usePcrItemsForThisCompetition } from "../utils/usePcrItemsForThisCompetition";

export interface ProjectChangeRequestPrepareParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const PCRPreparePage = (props: BaseProps & ProjectChangeRequestPrepareParams) => {
  const { project, pcr, pcrs, statusChanges, editableItemTypes, isMultipleParticipants, numberOfPartners } =
    usePCRPrepareQuery(props.projectId, props.pcrId);

  const { getPcrItemContent } = useGetPcrItemMetadata();

  const pcrItems = pcr.items.map(x => ({
    shortName: getPcrItemContent(x.shortName).name,
    status: getPcrItemTaskStatus(x.status),
  }));

  const availablePcrItems = usePcrItemsForThisCompetition(
    mapToSalesforceCompetitionTypes(project.competitionType),
    pcrs,
    pcr.id,
    numberOfPartners,
  );

  const { register, formState, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      comments: pcr.comments ?? "",
      items: pcrItems,
      reasoningStatus: getPcrItemTaskStatus(pcr.reasoningStatus),
      button_submit: "submit",
    },
    resolver: zodResolver(pcrPrepareSchema, { errorMap: pcrPrepareErrorMap }),
  });

  const registerButton = createRegisterButton(setValue, "button_submit");

  const { onUpdate, apiError, isFetching } = useOnUpdatePcrPrepare(props.pcrId, pcr, project);

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
      validationErrors={validatorErrors}
      apiError={apiError}
    >
      <ProjectChangeRequestOverviewSummary
        pcr={pcr}
        projectId={project.id}
        hideAddTypesLink={availablePcrItems.every(x => x.disabled)}
      />
      <ProjectChangeRequestOverviewTasks
        pcr={pcr as Pick<PCRDto, "id" | "reasoningStatus"> & { items: GetItemTaskProps["item"][] }}
        projectId={project.id}
        editableItemTypes={editableItemTypes}
        rhfErrors={validatorErrors as TaskErrors}
        mode="prepare"
      />

      <ProjectChangeRequestOverviewLog statusChanges={statusChanges} />

      <Form data-qa="prepare-form" onSubmit={handleSubmit(data => onUpdate({ data }))}>
        <Fieldset>
          <Legend>{getContent(x => x.pages.pcrOverview.addComments)}</Legend>
          <TextAreaField
            id="comments"
            {...register("comments")}
            error={validatorErrors?.comments as RhfError}
            hint={getContent(x => x.pcrMessages.additionalCommentsGuidance)}
            data-qa="info-text-area"
            characterCount={characterCount}
            disabled={isFetching}
            defaultValue={pcr.comments}
          />
        </Fieldset>
        <Fieldset data-qa="save-buttons">
          {isMultipleParticipants && <P>{getContent(x => x.pcrMessages.submittingGuidance)}</P>}

          <SubmitButton {...registerButton("submit")} disabled={isFetching}>
            {getContent(x => x.pages.pcrOverview.submitRequest)}
          </SubmitButton>

          <SubmitButton disabled={isFetching} secondary {...registerButton("save-and-return")}>
            {getContent(x => x.pages.pcrOverview.saveAndReturn)}
          </SubmitButton>
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
