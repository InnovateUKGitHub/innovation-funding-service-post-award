import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { ProjectRole } from "@framework/constants/project";
import { useContent } from "@ui/hooks/content.hook";
import { useMonitoringReportDeleteQuery, useOnMonitoringReportDelete } from "./monitoringReportDelete.logic";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink } from "@ui/components/atoms/Links/links";
import { useForm } from "react-hook-form";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";

export interface MonitoringReportDeleteParams {
  projectId: ProjectId;
  id: MonitoringReportId;
}

const DeleteVerificationPage = (props: BaseProps & MonitoringReportDeleteParams) => {
  const { getContent } = useContent();
  const { fragmentRef } = useMonitoringReportDeleteQuery(props.projectId);

  const { handleSubmit, formState } = useForm<{}>({});

  const {
    onUpdate: onDelete,
    apiError,
    isFetching,
  } = useOnMonitoringReportDelete(props.projectId, props.id, props.routes);

  const validatorErrors = useRhfErrors<{}>(formState.errors);

  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.monitoringReportDashboard.getLink({
            projectId: props.projectId,
            periodId: undefined,
          })}
        >
          <Content value={x => x.pages.monitoringReportsDelete.backLink} />
        </BackLink>
      }
      validationErrors={validatorErrors}
      apiError={apiError}
      fragmentRef={fragmentRef}
    >
      <Section>
        <P>{getContent(x => x.monitoringReportsMessages.deletingMonitoringReportMessage)}</P>
        <Form onSubmit={handleSubmit(data => onDelete({ data }))} data-qa="monitoringReportDelete">
          <Fieldset>
            <Button name="button_delete" type="submit" disabled={isFetching}>
              {getContent(x => x.pages.monitoringReportsDelete.buttonDeleteReport)}
            </Button>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

export const MonitoringReportDeleteRoute = defineRoute({
  routeName: "monitoringReportDeleteVerification",
  routePath: "/projects/:projectId/monitoring-reports/:id/delete",
  container: DeleteVerificationPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    id: route.params.id as MonitoringReportId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsDelete.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
});
