import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { IEditorStore, useStores } from "@ui/redux";
import { Pending } from "@shared/pending";
import { ProjectRole } from "@framework/constants";
import { useContent } from "@ui/hooks";

interface Callbacks {
  delete: (dto: Dtos.MonitoringReportDto) => void;
}

export interface MonitoringReportDeleteParams {
  projectId: ProjectId;
  id: MonitoringReportId;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

const DeleteForm = ACC.createTypedForm<Dtos.MonitoringReportDto>();

class DeleteVerificationComponent extends ContainerBase<MonitoringReportDeleteParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      editor: this.props.editor,
      project: this.props.project,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data.project, data.editor)} />;
  }

  renderContents(
    project: Dtos.ProjectDto,
    editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>,
  ) {
    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title {...project} />}
        backLink={
          <ACC.BackLink
            route={this.props.routes.monitoringReportDashboard.getLink({
              projectId: this.props.projectId,
              periodId: undefined,
            })}
          >
            <ACC.Content value={x => x.pages.monitoringReportsDelete.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
      >
        <ACC.Section>
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.monitoringReportsMessages.deletingMonitoringReportMessage} />
          </ACC.Renderers.SimpleString>
          <DeleteForm.Form editor={editor} qa="monitoringReportDelete">
            <DeleteForm.Fieldset>
              <DeleteForm.Button
                name="delete"
                styling="Warning"
                className="govuk-!-font-size-19"
                onClick={() => this.props.delete(editor.data)}
                value={editor.data.headerId}
              >
                <ACC.Content value={x => x.pages.monitoringReportsDelete.buttonDeleteReport} />
              </DeleteForm.Button>
            </DeleteForm.Fieldset>
          </DeleteForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const DeleteVerificationContainer = (props: MonitoringReportDeleteParams & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();
  const navigate = useNavigate();

  return (
    <DeleteVerificationComponent
      project={stores.projects.getById(props.projectId)}
      editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
      delete={dto =>
        stores.monitoringReports.deleteReport(
          props.projectId,
          props.id,
          dto,
          getContent(x => x.monitoringReportsMessages.onDeleteMonitoringReportMessage),
          () =>
            navigate(
              props.routes.monitoringReportDashboard.getLink({ projectId: dto.projectId, periodId: undefined }).path,
            ),
        )
      }
      {...props}
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
