import { ProjectRole } from "@framework/constants/project";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
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
import { useGetPcrTypeName } from "../utils/useGetPcrTypeName";
import { GetItemTaskProps } from "./GetItemTasks";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks, TaskErrors } from "./ProjectChangeRequestOverviewTasks";
import { FormValues, useOnUpdatePcrPrepare, usePCRPrepareQuery } from "./projectChangeRequestPrepare.logic";
import { pcrPrepareErrorMap, pcrPrepareSchema } from "./projectChangeRequestPrepare.zod";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";

export interface ProjectChangeRequestPrepareParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

const PCRPreparePage = (props: BaseProps & ProjectChangeRequestPrepareParams) => {
  const { project, pcr, statusChanges, editableItemTypes, isMultipleParticipants } = usePCRPrepareQuery(
    props.projectId,
    props.pcrId,
  );

  const getPcRTypeName = useGetPcrTypeName();

  const pcrItems = pcr.items.map((x, i) => ({
    shortName: getPcRTypeName(x.shortName),
    status: getPcrItemTaskStatus(x.status),
  }));

  const { register, formState, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      comments: pcr.comments ?? "",
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
            defaultValue={pcr.comments}
          />
        </Fieldset>
        <Fieldset data-qa="save-buttons">
          {isMultipleParticipants && <P>{getContent(x => x.pcrMessages.submittingGuidance)}</P>}

          <SubmitButton name="button_default" disabled={isFetching}>
            {getContent(x => x.pages.pcrOverview.submitRequest)}
          </SubmitButton>

          <Button
            secondarySubmit
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