import { useNavigate } from "react-router-dom";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { Pending } from "@shared/pending";
import { ProjectRole } from "@framework/constants/project";
import { useContent } from "@ui/hooks/content.hook";
import { useMonitoringReportDeleteQuery } from "./monitoringReportDelete.logic";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { PageLoader } from "@ui/components/loading";
import { Title } from "@ui/components/projects/title";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";

export interface MonitoringReportDeleteParams {
  projectId: ProjectId;
  id: MonitoringReportId;
}

interface Props {
  project: Pick<ProjectDto, "title" | "projectNumber">;
  editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>;
  delete: (dto: MonitoringReportDto) => void;
}

const DeleteForm = createTypedForm<MonitoringReportDto>();

const DeleteVerificationComponent = (props: BaseProps & Props & MonitoringReportDeleteParams) => {
  return (
    <Page
      pageTitle={<Title projectNumber={props.project.projectNumber} title={props.project.title} />}
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
      error={props.editor.error}
    >
      <Section>
        <SimpleString>
          <Content value={x => x.monitoringReportsMessages.deletingMonitoringReportMessage} />
        </SimpleString>
        <DeleteForm.Form editor={props.editor} qa="monitoringReportDelete">
          <DeleteForm.Fieldset>
            <DeleteForm.Button
              name="delete"
              styling="Warning"
              className="govuk-!-font-size-19"
              onClick={() => props.delete(props.editor.data)}
              value={props.editor.data.headerId}
            >
              <Content value={x => x.pages.monitoringReportsDelete.buttonDeleteReport} />
            </DeleteForm.Button>
          </DeleteForm.Fieldset>
        </DeleteForm.Form>
      </Section>
    </Page>
  );
};

const DeleteVerificationContainer = (props: MonitoringReportDeleteParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();

  const { project } = useMonitoringReportDeleteQuery(props.projectId);
  const combined = Pending.combine({
    editor: stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id),
  });

  return (
    <PageLoader
      pending={combined}
      render={data => (
        <DeleteVerificationComponent
          project={project}
          delete={dto =>
            stores.monitoringReports.deleteReport(
              props.projectId,
              props.id,
              dto,
              getContent(x => x.monitoringReportsMessages.onDeleteMonitoringReportMessage),
              () =>
                navigate(
                  props.routes.monitoringReportDashboard.getLink({ projectId: dto.projectId, periodId: undefined })
                    .path,
                ),
            )
          }
          {...props}
          {...data}
        />
      )}
    />
  );
};

export const MonitoringReportDeleteRoute = defineRoute({
  routeName: "monitoringReportDeleteVerification",
  routePath: "/projects/:projectId/monitoring-reports/:id/delete",
  container: DeleteVerificationContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    id: route.params.id as MonitoringReportId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.monitoringReportsDelete.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.MonitoringOfficer),
});
