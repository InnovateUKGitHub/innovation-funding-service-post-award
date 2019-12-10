import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, StoresConsumer } from "@ui/redux";

export interface MonitoringReportPrepareParams {
  projectId: string;
  id: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
  statusChanges: Pending<Dtos.MonitoringReportStatusChangeDto[]>;
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean) => void;
}

class PrepareMonitoringReportComponent extends ContainerBase<MonitoringReportPrepareParams, Data, Callbacks> {
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
          onSave={(dto, submit) => this.props.onChange(true, dto, submit)}
          renderLog={() => this.renderLog()}
        />
      </ACC.Page>
    );
  }

  private renderLog() {
    return (
      <ACC.Accordion>
        <ACC.AccordionItem title="Status and comments log" qa="status-and-comments-log">
          {/* Keeping logs inside loader because accordion defaults to closed*/}
          <ACC.Loader
            pending={this.props.statusChanges}
            render={(statusChanges) => (
              <ACC.Logs data={statusChanges} qa="monitoring-report-status-change-table" />
            )}
          />
        </ACC.AccordionItem>
      </ACC.Accordion>);
  }
}

const PrepareMonitoringReportContainer = (props: MonitoringReportPrepareParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PrepareMonitoringReportComponent
          project={stores.projects.getById(props.projectId)}
          statusChanges={stores.monitoringReports.getStatusChanges(props.projectId, props.id)}
          editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
          onChange={(save, dto, submit) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              stores.navigation.navigateTo(props.routes.monitoringReportDashboard.getLink({ projectId: dto.projectId }));
            });
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const MonitoringReportPrepareRoute = defineRoute({
  routeName: "monitoringReportPrepare",
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare",
  container: PrepareMonitoringReportContainer,
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getTitle: () => ({ htmlTitle: "Edit monitoring report", displayTitle: "Monitoring report" }),
});
