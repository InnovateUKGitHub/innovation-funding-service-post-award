import React from "react";
import * as ACC from "@ui/components/index";
import * as Actions from "@ui/redux/actions/index";
import * as Selectors from "@ui/redux/selectors/index";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore } from "@ui/redux";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";
import { MonitoringReportDashboardRoute } from "@ui/containers";

export interface MonitoringReportCreateParams {
  projectId: string;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (dto: Dtos.MonitoringReportDto, project: Dtos.ProjectDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, project: Dtos.ProjectDto, submit: boolean) => void;
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
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        tabs={<ACC.MonitoringReports.Navigation projectId={this.props.projectId} id={null as any} />}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.MonitoringReportFormComponent
          editor={editor}
          project={project}
          onChange={this.props.onChange}
          onSave={this.props.onSave}
        />
      </ACC.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<MonitoringReportCreateParams, Data, Callbacks>(CreateMonitoringReportComponent);

const MonitoringReportCreate = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    editor: Selectors.getMonitoringReportEditor(props.projectId).get(state),
  }),
  withCallbacks: (dispatch) => ({
    onChange: (dto, project) => {
      dispatch(Actions.validateMonitoringReport(dto.projectId, dto.headerId, dto, dto.questions, project));
    },
    onSave: (dto, project, submit) => {
      dispatch(Actions.saveMonitoringReport(dto.projectId, dto.headerId, dto, dto.questions, project, submit, () => {
        dispatch(Actions.navigateTo(MonitoringReportDashboardRoute.getLink({ projectId: dto.projectId })));
      }));
    }
  })
});

export const MonitoringReportCreateRoute = containerDefinition.route({
  routeName: "monitoringReportCreate",
  routePath: "/projects/:projectId/monitoring-reports/create",
  getParams: (r) => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }, features) => features.monitoringReports && auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReportQuestions()
  ],
  getTitle: () => ({
    htmlTitle: "Create monitoring report",
    displayTitle: "Monitoring report"
  }),
  container: MonitoringReportCreate
});
