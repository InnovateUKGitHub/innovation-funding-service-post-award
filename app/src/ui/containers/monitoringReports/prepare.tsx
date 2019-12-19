import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { ILinkInfo } from "@framework/types";
import { MonitoringReportWorkflow } from "@ui/containers/monitoringReports/workflow";

export interface MonitoringReportPrepareParams {
  projectId: string;
  id: string;
  step: number;
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean, link?: ILinkInfo) => void;
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
    const workflow = MonitoringReportWorkflow.getWorkflow(editor.data, this.props.step);
    const step = workflow.getCurrentStepInfo();
    return (
      <ACC.Page
        backLink={this.getBackLink(workflow)}
        pageTitle={<ACC.Projects.Title project={project} />}
        validator={editor.validator}
        error={editor.error}
      >
        { step && step.stepRender({
          editor,
          onChange: (dto) => this.props.onChange(false, dto),
          onSave: (dto, progress) => this.props.onChange(true, dto, false, this.getForwardLink(progress, workflow))
        })}
      </ACC.Page>
    );
  }

  private getForwardLink(progress: boolean, workflow: MonitoringReportWorkflow) {
    if (!progress) {
      return this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId });
    }
    const nextStep = workflow.getNextStepInfo();
    if (!nextStep) {
      return this.props.routes.monitoringReportSummary.getLink({ projectId: this.props.projectId, id: this.props.id, mode: "prepare" });
    }
    return this.props.routes.monitoringReportPrepare.getLink({ projectId: this.props.projectId, id: this.props.id, step: nextStep.stepNumber });
  }

  private getBackLink(workflow: MonitoringReportWorkflow) {
    const prevStep = workflow.getPrevStepInfo();
    if (!prevStep) {
      return <ACC.BackLink route={this.props.routes.monitoringReportPreparePeriod.getLink({ projectId: this.props.projectId, id: this.props.id })}>Back to monitoring report period</ACC.BackLink>;
    }
    return <ACC.BackLink route={this.props.routes.monitoringReportPrepare.getLink({ projectId: this.props.projectId, id: this.props.id, step: prevStep.stepNumber })}>Back to previous question</ACC.BackLink>;
  }
}

const PrepareMonitoringReportContainer = (props: MonitoringReportPrepareParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <PrepareMonitoringReportComponent
          project={stores.projects.getById(props.projectId)}
          editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
          onChange={(save, dto, submit, link) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              if(link) stores.navigation.navigateTo(link);
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
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare?:step",
  container: PrepareMonitoringReportContainer,
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id, step: parseInt(r.params.step, 10) }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getTitle: () => ({ htmlTitle: "Edit monitoring report", displayTitle: "Monitoring report" }),
});
