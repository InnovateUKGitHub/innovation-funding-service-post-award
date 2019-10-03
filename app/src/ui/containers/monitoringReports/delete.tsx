import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { MonitoringReportDashboardRoute } from "@ui/containers";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { IEditorStore } from "@ui/redux";
import { Pending } from "@shared/pending";
import { StoresConsumer } from "@ui/redux";

interface Callbacks {
  delete: (dto: Dtos.MonitoringReportDto) => void;
}

export interface MonitoringReportDeleteParams {
  projectId: string;
  id: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

class DeleteVerificationComponent extends ContainerBase<MonitoringReportDeleteParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      editor: this.props.editor,
      project: this.props.project
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data.project, data.editor)} />;
  }

  renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const DeleteForm = ACC.TypedForm<Dtos.MonitoringReportDto>();
    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project} />}
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        error={editor.error}
      >
        <ACC.Section>
          <ACC.Renderers.SimpleString>All the information in the report will be permanently removed.</ACC.Renderers.SimpleString>
          <DeleteForm.Form editor={editor} qa="monitoringReportDelete">
            <DeleteForm.Fieldset>
              <DeleteForm.Button
                name="delete"
                styling="Warning"
                className="govuk-!-font-size-19"
                onClick={() => this.props.delete(editor.data)}
                value={editor.data.headerId}
              >
                Delete report
              </DeleteForm.Button>
            </DeleteForm.Fieldset>
          </DeleteForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const DeleteVerificationContainer = (props: MonitoringReportDeleteParams&BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <DeleteVerificationComponent
          project={stores.projects.getById(props.projectId)}
          editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
          delete={(dto) => stores.monitoringReports.deleteReport(props.projectId, props.id, dto, "You have deleted the monitoring report.", () => stores.navigation.navigateTo(MonitoringReportDashboardRoute.getLink({ projectId: dto.projectId })))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const MonitoringReportDeleteRoute = defineRoute({
  routeName: "monitoringReportDeleteVerification",
  routePath: "/projects/:projectId/monitoring-reports/:id/delete",
  container: DeleteVerificationContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    id: route.params.id
  }),
  getTitle: () => ({
    htmlTitle: "Delete monitoring report",
    displayTitle: "Monitoring report"
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
});
