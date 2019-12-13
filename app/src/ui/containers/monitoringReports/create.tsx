import React from "react";
import * as ACC from "@ui/components/index";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, StoresConsumer } from "@ui/redux";

export interface MonitoringReportCreateParams {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean, progress?: boolean) => void;
}

class CreateMonitoringReportComponent extends ContainerBase<MonitoringReportCreateParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      editor: this.props.editor,
      project: this.props.project
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.editor)} />;
  }

  private renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.MonitoringReportFormComponent
          editor={editor}
          onChange={(dto) => this.props.onChange(false, dto)}
          onSave={(dto, submit, progress) => this.props.onChange(true, dto, submit, progress)}
        />
      </ACC.Page>
    );
  }
}

const MonitoringReportCreateContainer = (props: MonitoringReportCreateParams&BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <CreateMonitoringReportComponent
          project={stores.projects.getById(props.projectId)}
          editor={stores.monitoringReports.getCreateMonitoringReportEditor(props.projectId)}
          onChange={(save, dto, submit, progress) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, (id) => {
              if(progress) {
                stores.navigation.navigateTo(props.routes.monitoringReportSummary.getLink({ projectId: props.projectId, id, mode: "prepare" }));
              } else {
                stores.navigation.navigateTo(props.routes.monitoringReportDashboard.getLink({ projectId: dto.projectId }));
              }
            });
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const MonitoringReportCreateRoute = defineRoute({
  routeName: "monitoringReportCreate",
  routePath: "/projects/:projectId/monitoring-reports/create",
  container: MonitoringReportCreateContainer,
  getParams: (r) => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getTitle: () => ({
    htmlTitle: "Create monitoring report",
    displayTitle: "Monitoring report"
  }),
});
