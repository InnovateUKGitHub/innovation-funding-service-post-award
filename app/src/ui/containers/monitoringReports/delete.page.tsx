import { useNavigate } from "react-router-dom";
import { PageLoader, Page, Content, BackLink, Projects, createTypedForm, Section, Renderers } from "@ui/components";
import * as Dtos from "@framework/dtos";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { IEditorStore, useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import { ProjectRole } from "@framework/constants";
import { useContent } from "@ui/hooks";
import { useMonitoringReportDeleteQuery } from "./monitoringReportDelete.logic";

export interface MonitoringReportDeleteParams {
  projectId: ProjectId;
  id: MonitoringReportId;
}

interface Props {
  project: Pick<Dtos.ProjectDto, "title" | "projectNumber">;
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  delete: (dto: Dtos.MonitoringReportDto) => void;
}

const DeleteForm = createTypedForm<Dtos.MonitoringReportDto>();

const DeleteVerificationComponent = (props: BaseProps & Props & MonitoringReportDeleteParams) => {
  return (
    <Page
      pageTitle={<Projects.Title projectNumber={props.project.projectNumber} title={props.project.title} />}
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
        <Renderers.SimpleString>
          <Content value={x => x.monitoringReportsMessages.deletingMonitoringReportMessage} />
        </Renderers.SimpleString>
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
