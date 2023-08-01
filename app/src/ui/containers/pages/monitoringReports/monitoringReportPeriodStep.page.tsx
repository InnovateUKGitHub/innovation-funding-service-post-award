import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import {
  useMonitoringReportPeriodStepQuery,
  useOnMonitoringReportUpdatePeriodStep,
  FormValues,
} from "./monitoringReportPeriodStep.logic";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { useContent } from "@ui/hooks/content.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { Section } from "@ui/components/atomicDesign/atoms/form/Section/Section";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { createMonitoringReportErrorMap, createMonitoringReportSchema } from "./create/monitoringReportCreate.zod";

export interface MonitoringReportPreparePeriodParams {
  projectId: ProjectId;
  id: MonitoringReportId;
}

const PeriodStepPage = (props: BaseProps & MonitoringReportPreparePeriodParams) => {
  const { project, monitoringReport } = useMonitoringReportPeriodStepQuery(props.projectId, props.id);
  const { getContent } = useContent();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      period: monitoringReport.periodId,
    },
    resolver: zodResolver(createMonitoringReportSchema(project.periodId), { errorMap: createMonitoringReportErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnMonitoringReportUpdatePeriodStep(
    props.projectId,
    monitoringReport.headerId,
    props.routes,
  );

  const validatorErrors = useRhfErrors<FormValues>(formState.errors);

  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.monitoringReportWorkflow.getLink({
            projectId: props.projectId,
            id: props.id,
            mode: "prepare",
            step: undefined,
          })}
        >
          <Content value={x => x.pages.monitoringReportsPeriodStep.backLink} />
        </BackLink>
      }
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      validationErrors={validatorErrors}
      apiError={apiError}
    >
      <Section>
        <P>{getContent(x => x.components.reportForm.reportMessage)}</P>
        <P>{getContent(x => x.components.reportForm.questionScoreMessage)}</P>
      </Section>
      <Section>
        <Form data-qa="monitoringReportCreateForm" onSubmit={handleSubmit(onUpdate)}>
          <Field labelBold label="Period" id="period" error={validatorErrors?.period as RhfError}>
            <NumberInput id="period" inputWidth={3} {...register("period")} />
          </Field>
          <Fieldset data-qa="save-buttons">
            <Button disabled={isFetching} type="submit" name="button_save-continue">
              {getContent(x => x.components.reportForm.continueText)}
            </Button>
            <Button disabled={isFetching} secondary type="submit" name="button_save-return">
              {getContent(x => x.components.reportForm.saveAndReturnText)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

export const MonitoringReportPreparePeriodRoute = defineRoute({
  routeName: "monitoringReportPreparePeriod",
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare-period",
  container: PeriodStepPage,
  getParams: r => ({ projectId: r.params.projectId as ProjectId, id: r.params.id as MonitoringReportId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsPeriodStep.title),
});