import { ProjectRole } from "@framework/constants/project";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import {
  FormValues,
  useMonitoringReportCreateQuery,
  useOnMonitoringReportCreate,
} from "./monitoringReportCreate.logic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContent } from "@ui/hooks/content.hook";
import { FieldError, useForm } from "react-hook-form";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { createMonitoringReportSchema, createMonitoringReportErrorMap } from "./monitoringReportCreate.zod";

export interface MonitoringReportCreateParams {
  projectId: ProjectId;
}

const MonitoringReportCreatePage = (props: MonitoringReportCreateParams & BaseProps) => {
  const { project } = useMonitoringReportCreateQuery(props.projectId);
  const { getContent } = useContent();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      period: undefined,
    },
    resolver: zodResolver(createMonitoringReportSchema(project.periodId), { errorMap: createMonitoringReportErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnMonitoringReportCreate(props.projectId, props.routes);

  const validatorErrors = useRhfErrors<FormValues>(formState.errors);

  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.monitoringReportDashboard.getLink({ projectId: props.projectId, periodId: undefined })}
        >
          <Content value={x => x.pages.monitoringReportsCreate.backLink} />
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
          <Field labelBold label="Period" id="period" error={formState?.errors?.period as FieldError}>
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

export const MonitoringReportCreateRoute = defineRoute<{
  projectId: ProjectId;
}>({
  allowRouteInActiveAccess: true,
  routeName: "monitoringReportCreate",
  routePath: "/projects/:projectId/monitoring-reports/create",
  container: MonitoringReportCreatePage,
  getParams: r => ({ projectId: r.params.projectId as ProjectId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsCreate.title),
});
