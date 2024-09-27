import { ProjectRole } from "@framework/constants/project";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useMonitoringReportCreateQuery, useOnMonitoringReportCreate } from "./monitoringReportCreate.logic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContent } from "@ui/hooks/content.hook";
import { useForm } from "react-hook-form";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { BackLink } from "@ui/components/atoms/Links/links";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Field } from "@ui/components/molecules/form/Field/Field";
import { NumberInput } from "@ui/components/atoms/form/NumberInput/NumberInput";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";
import {
  createMonitoringReportSchema,
  createMonitoringReportErrorMap,
  MonitoringReportCreateSchema,
} from "./monitoringReportCreate.zod";
import { createRegisterButton } from "@framework/util/registerButton";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";

export interface MonitoringReportCreateParams {
  projectId: ProjectId;
}

const MonitoringReportCreatePage = (props: MonitoringReportCreateParams & BaseProps) => {
  const { project, fragmentRef } = useMonitoringReportCreateQuery(props.projectId);
  const { getContent } = useContent();

  const { register, handleSubmit, formState, setValue, setError } = useForm<z.infer<MonitoringReportCreateSchema>>({
    defaultValues: {
      period: undefined,
      button_submit: "saveAndContinue",
    },
    resolver: zodResolver(createMonitoringReportSchema(project.periodId), { errorMap: createMonitoringReportErrorMap }),
  });

  const registerButton = createRegisterButton(setValue, "button_submit");

  const { onUpdate, apiError, isFetching } = useOnMonitoringReportCreate(props.projectId, props.routes);

  const validatorErrors = useZodErrors(setError, formState.errors);

  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.monitoringReportDashboard.getLink({ projectId: props.projectId, periodId: undefined })}
        >
          <Content value={x => x.pages.monitoringReportsCreate.backLink} />
        </BackLink>
      }
      validationErrors={validatorErrors}
      apiError={apiError}
      fragmentRef={fragmentRef}
    >
      <Section>
        <P>{getContent(x => x.components.reportForm.reportMessage)}</P>
        <P>{getContent(x => x.components.reportForm.questionScoreMessage)}</P>
      </Section>
      <Section>
        <Form
          data-qa="monitoringReportCreateForm"
          onSubmit={handleSubmit(data => {
            onUpdate({ data });
          })}
        >
          <input type="hidden" {...register("form")} value={FormTypes.MonitoringReportCreate} />
          <Field labelBold label="Period" id="period" error={validatorErrors?.period as RhfError}>
            <NumberInput id="period" inputWidth={3} {...register("period")} />
          </Field>
          <Fieldset data-qa="save-buttons">
            <Button disabled={isFetching} type="submit" {...registerButton("saveAndContinue")}>
              {getContent(x => x.components.reportForm.continueText)}
            </Button>
            <Button disabled={isFetching} secondary type="submit" {...registerButton("saveAndReturn")}>
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
