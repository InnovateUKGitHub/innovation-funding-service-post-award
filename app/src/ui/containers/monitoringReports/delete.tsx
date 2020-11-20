import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { ContentConsumer, IEditorStore } from "@ui/redux";
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
        backLink={<ACC.BackLink route={this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId })}><ACC.Content value={(x) => x.monitoringReportsDelete.backLink()} /></ACC.BackLink>}
        error={editor.error}
      >
        <ACC.Section>
          <ACC.Renderers.SimpleString><ACC.Content value={(x) => x.monitoringReportsDelete.messages.deletingMonitoringReportMessage} /></ACC.Renderers.SimpleString>
          <DeleteForm.Form editor={editor} qa="monitoringReportDelete">
            <DeleteForm.Fieldset>
              <DeleteForm.Button
                name="delete"
                styling="Warning"
                className="govuk-!-font-size-19"
                onClick={() => this.props.delete(editor.data)}
                value={editor.data.headerId}
              >
                <ACC.Content value={(x) => x.monitoringReportsDelete.deleteReportButton()} />
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
        <ContentConsumer>
          {
            content => (
              <DeleteVerificationComponent
                project={stores.projects.getById(props.projectId)}
                editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
                delete={(dto) => stores.monitoringReports.deleteReport(props.projectId, props.id, dto, content.monitoringReportsDelete.messages.onDeleteMonitoringReportMessage.content, () => stores.navigation.navigateTo(props.routes.monitoringReportDashboard.getLink({ projectId: dto.projectId })))}
                {...props}
              />
            )
          }
        </ContentConsumer>
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
  getTitle: ({content}) => content.monitoringReportsDelete.title(),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
});
