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
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean, progress?: boolean) => void;
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
    const title = <ACC.PeriodTitle periodId={editor.data.periodId} periodStartDate={editor.data.startDate} periodEndDate={editor.data.endDate} />;
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.monitoringReportPreparePeriod.getLink({ projectId: this.props.projectId, id: this.props.id })}>Back to monitoring report period</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section title={title}>
          <ACC.MonitoringReportFormComponent
            editor={editor}
            onChange={(dto) => this.props.onChange(false, dto)}
            onSave={(dto, submit, progress) => this.props.onChange(true, dto, submit, progress)}
          />
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const PrepareMonitoringReportContainer = (props: MonitoringReportPrepareParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PrepareMonitoringReportComponent
          project={stores.projects.getById(props.projectId)}
          editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
          onChange={(save, dto, submit, progress) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              if(progress) {
                stores.navigation.navigateTo(props.routes.monitoringReportSummary.getLink({ projectId: props.projectId, id: props.id, mode: "prepare" }));
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

export const MonitoringReportPrepareRoute = defineRoute({
  routeName: "monitoringReportPrepare",
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare",
  container: PrepareMonitoringReportContainer,
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getTitle: () => ({ htmlTitle: "Edit monitoring report", displayTitle: "Monitoring report" }),
});
