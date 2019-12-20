import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { ILinkInfo } from "@framework/types";

export interface MonitoringReportPreparePeriodParams {
  projectId: string;
  id: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean, link?: ILinkInfo) => void;
}

class Component extends ContainerBase<MonitoringReportPreparePeriodParams, Data, Callbacks> {
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
        <ACC.MonitoringReportPeriodFormComponent
          editor={editor}
          onChange={(dto) => this.props.onChange(false, dto)}
          onSave={(dto, submit, progress) => this.props.onChange(true, dto, submit, this.getLink(progress))}
        />
      </ACC.Page>
    );
  }
  private getLink(progress: boolean) {
    if (!progress) {
      return this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId });
    }
    return this.props.routes.monitoringReportWorkflow.getLink({ projectId: this.props.projectId, id: this.props.id, mode: "prepare", step: 1 });
  }
}

const Container = (props: MonitoringReportPreparePeriodParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          project={stores.projects.getById(props.projectId)}
          editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
          onChange={(save, dto, submit, link) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              if(link) {
                stores.navigation.navigateTo(link);
              }
            });
          }}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const MonitoringReportPreparePeriodRoute = defineRoute({
  routeName: "monitoringReportPreparePeriod",
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare-period",
  container: Container,
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getTitle: () => ({ htmlTitle: "Edit monitoring report", displayTitle: "Monitoring report" }),
});
