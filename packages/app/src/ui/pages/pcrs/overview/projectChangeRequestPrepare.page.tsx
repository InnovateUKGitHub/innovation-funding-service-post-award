import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitButton } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { BackLink } from "@ui/components/atoms/Links/links";
import { TextAreaField } from "@ui/components/molecules/form/TextFieldArea/TextAreaField";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { useContent } from "@ui/hooks/content.hook";
import { useForm } from "react-hook-form";
import { BaseProps, defineRoute } from "../../../app/containerBase";
import { getPcrItemTaskStatus } from "../utils/getPcrItemTaskStatus";
import { GetItemTaskProps } from "./GetItemTasks";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks, TaskErrors } from "./ProjectChangeRequestOverviewTasks";
import { useOnUpdatePcrPrepare, usePCRPrepareQuery } from "./projectChangeRequestPrepare.logic";
import { PcrPrepareSchema, pcrPrepareErrorMap, pcrPrepareSchema } from "./projectChangeRequestPrepare.zod";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { createRegisterButton } from "@framework/util/registerButton";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
import { mapToSalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import { usePcrItemsForThisCompetition } from "../utils/usePcrItemsForThisCompetition";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";

export interface ProjectChangeRequestPrepareParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const PCRPreparePage = (props: BaseProps & ProjectChangeRequestPrepareParams) => {
  const {
    project,
    pcr,
    pcrs,
    statusChanges,
    editableItemTypes,
    isMultipleParticipants,
    numberOfPartners,
    fragmentRef,
  } = usePCRPrepareQuery(props.projectId, props.pcrId);

  const { getPcrItemContent } = useGetPcrItemMetadata();

  const pcrItems = pcr.items.map(x => ({
    shortName: getPcrItemContent(x.shortName).name,
    status: getPcrItemTaskStatus(x.status),
    id: x.id,
  }));

  const availablePcrItems = usePcrItemsForThisCompetition(
    mapToSalesforceCompetitionTypes(project.competitionType),
    pcrs,
    pcr.id,
    numberOfPartners,
  );

  const { register, formState, handleSubmit, watch, setValue, setError } = useForm<z.infer<PcrPrepareSchema>>({
    defaultValues: {
      form: FormTypes.PcrPrepare,
      comments: pcr.comments ?? "",
      items: pcrItems,
      reasoningStatus: getPcrItemTaskStatus(pcr.reasoningStatus),
      button_submit: "save-and-return",
    },
    resolver: zodResolver(pcrPrepareSchema, { errorMap: pcrPrepareErrorMap }),
  });

  const registerButton = createRegisterButton(setValue, "button_submit");

  const { onUpdate, apiError, isFetching } = useOnUpdatePcrPrepare(props.pcrId, pcr, project);

  const { getContent } = useContent();
  const characterCount = watch("comments")?.length ?? 0;

  const validatorErrors = useZodErrors(setError, formState.errors);

  return (
    <Page
      backLink={
        <BackLink route={props.routes.pcrsDashboard.getLink({ projectId: project.id })}>
          {getContent(x => x.pages.pcrOverview.backToPcrs)}
        </BackLink>
      }
      validationErrors={validatorErrors}
      apiError={apiError}
      fragmentRef={fragmentRef}
    >
      <ProjectChangeRequestOverviewSummary
        pcr={pcr}
        projectId={project.id}
        hideAddTypesLink={availablePcrItems.every(x => x.hidden)}
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
        <input type="hidden" name="form" value={FormTypes.PcrPrepare} />
        <input type="hidden" {...register("reasoningStatus")} value={getPcrItemTaskStatus(pcr.reasoningStatus)} />
        <input type="hidden" name="items" value={JSON.stringify(pcrItems)} />
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});
