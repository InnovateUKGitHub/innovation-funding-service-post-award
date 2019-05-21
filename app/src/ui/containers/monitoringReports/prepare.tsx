import React from "react";
import * as ACC from "@ui/components";
import * as Actions from "@ui/redux/actions/index";
import * as Selectors from "@ui/redux/selectors/index";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IEditorStore } from "@ui/redux";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";
import { MonitoringReportDashboardRoute } from "@ui/containers";

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
  onChange: (dto: Dtos.MonitoringReportDto, project: Dtos.ProjectDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, project: Dtos.ProjectDto, submit: boolean) => void;
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
    const tabs = [{
      text: "Questions",
      hash: "details",
      default: true,
      content: this.renderFormTab(project, editor),
      qa: "MRPrepareTab"
    }, {
      text: "Log",
      hash: "log",
      content: this.renderLogTab(),
      qa: "MRPrepareLogTab"
    }];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={MonitoringReportDashboardRoute.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        validator={editor.validator}
        error={editor.error}
        tabs={<ACC.HashTabs tabList={tabs}/>}
      >
        <ACC.HashTabsContent tabList={tabs}/>
      </ACC.Page>
    );
  }

  private renderFormTab(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    return (
      <ACC.MonitoringReportFormComponent
        editor={editor}
        project={project}
        onChange={this.props.onChange}
        onSave={this.props.onSave}
      />
    );
  }

  private renderLogTab() {
    return (
      <ACC.Loader
        pending={this.props.statusChanges}
        render={(statusChanges) => <ACC.Section><ACC.Logs data={statusChanges} qa="monitoring-report-status-change-table"/></ACC.Section>}
      />);
  }
}

const containerDefinition = ReduxContainer.for<MonitoringReportPrepareParams, Data, Callbacks>(PrepareMonitoringReportComponent);

const MonitoringReportPrepare = containerDefinition.connect({
  withData: (state, props) => ({
    project: Selectors.getProject(props.projectId).getPending(state),
    editor: Selectors.getMonitoringReportEditor(props.projectId, props.id).get(state),
    statusChanges: Selectors.getMonitoringReportStatusChanges(props.id).getPending(state),
  }),
  withCallbacks: (dispatch) => ({
    onChange: (dto, project) => {
      dispatch(Actions.validateMonitoringReport(dto.projectId, dto.headerId, dto, dto.questions, project));
    },
    onSave: (dto, project, submit) => {
      dispatch(Actions.saveMonitoringReport(dto.projectId, dto.headerId, dto, dto.questions, project, submit, () => {
        dispatch(Actions.navigateBackTo(MonitoringReportDashboardRoute.getLink({ projectId: dto.projectId })));
      }));
    }
  })
});

export const MonitoringReportPrepareRoute = containerDefinition.route({
  routeName: "monitoringReportPrepare",
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id }),
  accessControl: (auth, { projectId }, features) => features.monitoringReports && auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadMonitoringReportQuestions(),
    Actions.loadMonitoringReport(params.projectId, params.id),
    Actions.loadMonitoringReportStatusChanges(params.projectId, params.id),
  ],
  getTitle: () => ({ htmlTitle: "Edit monitoring report", displayTitle: "Monitoring report" }),
  container: MonitoringReportPrepare,
});
