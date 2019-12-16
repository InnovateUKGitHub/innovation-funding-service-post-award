import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { numberComparator } from "@framework/util";
import { ILinkInfo } from "@framework/types";
import { NotFoundError } from "@server/features/common";

export interface MonitoringReportPrepareParams {
  projectId: string;
  id: string;
  questionNumber: number;
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

    const questionIndex = editor.data.questions.findIndex(x => x.displayOrder === this.props.questionNumber);
    if (questionIndex < 0) {
      throw new NotFoundError();
    }

    const title = <ACC.PeriodTitle periodId={editor.data.periodId} periodStartDate={editor.data.startDate} periodEndDate={editor.data.endDate} />;
    return (
      <ACC.Page
        backLink={this.getBackLink(editor)}
        pageTitle={<ACC.Projects.Title project={project} />}
        validator={editor.validator}
        error={editor.error}
      >
        <ACC.Section title={title} subtitle={`Question ${questionIndex + 1} of ${editor.data.questions.length}`}>
          <ACC.MonitoringReportFormComponent
            editor={editor}
            questionNumber={this.props.questionNumber}
            onChange={(dto) => this.props.onChange(false, dto)}
            onSave={(dto, submit, progress) => this.props.onChange(true, dto, submit, this.getForwardLink(progress, editor))}
          />
        </ACC.Section>
      </ACC.Page>
    );
  }
  private getForwardLink(progress: boolean, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    if (!progress) {
      return this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId });
    }
    const questions = editor.data.questions.map(x => x.displayOrder).sort(numberComparator);
    const lastQuestion = questions[questions.length - 1];
    if (this.props.questionNumber === lastQuestion) {
      return this.props.routes.monitoringReportSummary.getLink({ projectId: this.props.projectId, id: this.props.id, mode: "prepare" });
    }

    const currentQuestionIndex = questions.indexOf(this.props.questionNumber);
    const nextQuestion = questions[currentQuestionIndex + 1];
    return this.props.routes.monitoringReportPrepare.getLink({ projectId: this.props.projectId, id: this.props.id, questionNumber: nextQuestion });
  }
  private getBackLink(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const questions = editor.data.questions.map(x => x.displayOrder).sort(numberComparator);
    const firstQuestion = questions[0];
    if (this.props.questionNumber === firstQuestion) {
      return <ACC.BackLink route={this.props.routes.monitoringReportPreparePeriod.getLink({ projectId: this.props.projectId, id: this.props.id })}>Back to monitoring report period</ACC.BackLink>;
    }

    const currentQuestionIndex = questions.indexOf(this.props.questionNumber);
    const prevQuestion = questions[currentQuestionIndex - 1];
    return <ACC.BackLink route={this.props.routes.monitoringReportPrepare.getLink({ projectId: this.props.projectId, id: this.props.id, questionNumber: prevQuestion })}>Back to previous question</ACC.BackLink>;
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
  routePath: "/projects/:projectId/monitoring-reports/:id/prepare?:questionNumber",
  container: PrepareMonitoringReportContainer,
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id, questionNumber: parseInt(r.params.questionNumber, 10) }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(Dtos.ProjectRole.MonitoringOfficer),
  getTitle: () => ({ htmlTitle: "Edit monitoring report", displayTitle: "Monitoring report" }),
});
