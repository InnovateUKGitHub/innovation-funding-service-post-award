import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { ContentConsumer, IEditorStore, StoresConsumer } from "@ui/redux";
import { ILinkInfo } from "@framework/types";
import { MonitoringReportWorkflowDef } from "@ui/containers/monitoringReports/monitoringReportWorkflowDef";

export interface MonitoringReportWorkflowParams {
  projectId: string;
  id: string;
  step: number | undefined;
  mode: "view" | "prepare";
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean, link?: ILinkInfo) => void;
}

class Component extends ContainerBase<MonitoringReportWorkflowParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      editor: this.props.editor,
      project: this.props.project
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.editor)} />;
  }

  private renderContents(project: Dtos.ProjectDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const workflow = MonitoringReportWorkflowDef.getWorkflow(editor.data, this.props.step);
    return (
      <ACC.Page
        backLink={this.getBackLink(workflow)}
        pageTitle={<ACC.Projects.Title project={project} />}
        validator={workflow.getValidation(editor.validator)}
        error={editor.error}
      >
        {this.renderWorkflow(workflow, editor)}
      </ACC.Page>
    );
  }

  private renderWorkflow(workflow: MonitoringReportWorkflowDef, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    if (this.props.mode === "prepare" && !workflow.isOnSummary()) {
      return this.renderStep(workflow, editor);
    }
    return this.renderSummary(workflow, editor);
  }

  private renderSummary(workflow: MonitoringReportWorkflowDef, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const summary = workflow.getSummary();
    return summary && summary.summaryRender({
      projectId: this.props.projectId,
      id: this.props.id,
      mode: this.props.mode,
      editor,
      onChange: (dto: Dtos.MonitoringReportDto) => this.props.onChange(false, dto),
      onSave: (dto: Dtos.MonitoringReportDto, submit?: boolean) => this.props.onChange(true, dto, submit, this.getForwardLink(workflow, false)),
      routes: this.props.routes,
      // TODO type step name
      getEditLink: (stepName: string) => this.props.routes.monitoringReportWorkflow.getLink({
        projectId: this.props.projectId,
        id: this.props.id,
        mode: this.props.mode,
        step: workflow.findStepNumberByName(stepName)
      }),
    });
  }

  private renderStep(workflow: MonitoringReportWorkflowDef, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const step = workflow.getCurrentStepInfo();
    return step && step.stepRender({
      editor,
      onChange: (dto) => this.props.onChange(false, dto),
      onSave: (dto, progress) => this.props.onChange(true, dto, false, this.getForwardLink(workflow, progress))
    });
  }

  private getForwardLink(workflow: MonitoringReportWorkflowDef, progress: boolean) {
    if (progress) {
      const nextStep = workflow.getNextStepInfo();
      return this.props.routes.monitoringReportWorkflow.getLink({ projectId: this.props.projectId, id: this.props.id, mode: this.props.mode, step: nextStep && nextStep.stepNumber });
    }
    if (workflow.isOnSummary()) {
      return this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId });
    }
    return this.props.routes.monitoringReportWorkflow.getLink({ projectId: this.props.projectId, id: this.props.id, mode: this.props.mode, step: undefined });
  }

  private getBackLink(workflow: MonitoringReportWorkflowDef) {
    if (this.props.mode === "view") {
      return <ACC.BackLink route={this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId })}><ACC.Content value={(x) => x.monitoringReportsWorkflow.backLink()} /></ACC.BackLink>;
    }
    const prevStep = workflow.getPrevStepInfo();
    if (!prevStep) {
      return <ACC.BackLink route={this.props.routes.monitoringReportPreparePeriod.getLink({ projectId: this.props.projectId, id: this.props.id })}><ACC.Content value={(x) => x.monitoringReportsWorkflow.backLink()} /></ACC.BackLink>;
    }
    return <ACC.BackLink route={this.props.routes.monitoringReportWorkflow.getLink({ projectId: this.props.projectId, id: this.props.id, mode: this.props.mode, step: prevStep.stepNumber })}><ACC.Content value={(x) => x.monitoringReportsWorkflow.backToStepLink(prevStep.displayName.toLocaleLowerCase())} /></ACC.BackLink>;
  }
}

const Container = (props: MonitoringReportWorkflowParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <ContentConsumer>
          {
            content => (
              <Component
                project={stores.projects.getById(props.projectId)}
                editor={stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id)}
                onChange={(save, dto, submit, link) => {
                  stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
                    if (link) stores.navigation.navigateTo(link);
                  });
                }}
                {...props}
              />
            )
          }
        </ContentConsumer>
      )
    }
  </StoresConsumer>
);

export const MonitoringReportWorkflowRoute = defineRoute({
  routeName: "monitoringReportPrepare",
  routePath: "/projects/:projectId/monitoring-reports/:id/:mode<(prepare|view){1}>?:step",
  container: Container,
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id, mode: r.params.mode, step: parseInt(r.params.step, 10) }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getTitle: ({ params, content }) => (params.mode === "view" ? content.monitoringReportsWorkflow.viewMode.title() : content.monitoringReportsWorkflow.editMode.title()),
});
