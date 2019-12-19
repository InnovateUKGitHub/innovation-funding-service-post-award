import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import * as Dtos from "@framework/types";
import { Pending } from "../../../shared/pending";
import { MonitoringReportOptionDto, MonitoringReportQuestionDto, ProjectRole } from "@framework/types";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { Link, Section, SummaryList, SummaryListItem } from "../../components";
import { MonitoringReportDtoValidator, QuestionValidator } from "@ui/validators";
import { MonitoringReportWorkflow } from "@ui/containers/monitoringReports/workflow";

export interface MonitoringReportPrepareSummaryParams {
  projectId: string;
  id: string;
  mode: "prepare" | "view";
}

interface Data {
  project: Pending<Dtos.ProjectDto>;
  report: Pending<Dtos.MonitoringReportDto>;
  editor: Pending<IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>>;
  statusChanges: Pending<Dtos.MonitoringReportStatusChangeDto[]>;
}

interface Callbacks {
  onChange: (save: boolean, dto: Dtos.MonitoringReportDto, submit?: boolean) => void;
}

class DetailsComponent extends ContainerBase<MonitoringReportPrepareSummaryParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      report: this.props.report,
      project: this.props.project,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data.project, data.report, data.editor)} />;
  }

  private renderContents(project: Dtos.ProjectDto, report: Dtos.MonitoringReportDto, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const title = <ACC.PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />;
    const workflow = MonitoringReportWorkflow.getWorkflow(editor.data, undefined);
    return (
      <ACC.Page
        backLink={this.getBackLink(workflow)}
        pageTitle={<ACC.Projects.Title project={project}/>}
        error={editor.error}
        validator={editor.validator}
      >
        <ACC.Section title={title} qa="monitoringReportViewSection">
          {this.renderPeriod(editor)}
          {report.questions.map(q => this.renderResponse(workflow, editor, q))}
          {this.renderLog()}
          { this.props.mode === "prepare" && this.renderForm(editor)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private getBackLink(workflow: MonitoringReportWorkflow) {
    if (this.props.mode === "view") {
      return <ACC.BackLink route={this.props.routes.monitoringReportDashboard.getLink({ projectId: this.props.projectId })}>Back to monitoring reports</ACC.BackLink>;
    }
    return <ACC.BackLink route={this.props.routes.monitoringReportPrepare.getLink({ projectId: this.props.projectId, id: this.props.id, step: workflow.getPrevStepInfo()!.stepNumber })}>Back to edit monitoring report</ACC.BackLink>;
  }

  private renderLog() {
    return (
      <Section>
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
        </ACC.Accordion>
      </Section>
    );
  }

  private renderForm(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    return (
      <ACC.MonitoringReportSummaryFormComponent
        editor={editor}
        onChange={(dto) => this.props.onChange(false, dto)}
        onSave={(dto, submit) => this.props.onChange(true, dto, submit)}
      />
    );
  }

  private getAction(workflow: MonitoringReportWorkflow, validation: QuestionValidator, question: MonitoringReportQuestionDto) {
    if (this.props.mode !== "prepare") {
      return null;
    }
    return (
      <span id={validation.score.key}>
        <Link
          id={validation.comments.key}
          replace={true}
          route={this.props.routes.monitoringReportPrepare.getLink({projectId: this.props.projectId, id: this.props.id, step: workflow.findStepNumberByName(`question-${question.displayOrder}`)})}
        >
          Edit
        </Link>
      </span>
    );
  }

  private renderScore(workflow: MonitoringReportWorkflow, response: MonitoringReportOptionDto | undefined, validation: QuestionValidator, question: MonitoringReportQuestionDto) {
    if(!question.isScored) {
      return null;
    }
    return (
      <SummaryListItem
        validation={validation.score}
        label="Score"
        content={(response && `${response.questionScore} - ${response.questionText}`)}
        qa={`question-${question.displayOrder}-score`}
        action={this.getAction(workflow, validation, question)}
      />
    );
  }

  private renderComments(workflow: MonitoringReportWorkflow, validation: QuestionValidator, question: MonitoringReportQuestionDto) {
    return (
      <SummaryListItem
        validation={validation.comments}
        label="Comments"
        content={question.comments || ""}
        qa={`question-${question.displayOrder}-comments`}
        /*Put the action on the second item if not showing the first*/
        action={!question.isScored && this.getAction(workflow, validation, question)}
      />
    );
  }

  private renderPeriod(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const validation = editor && editor.validator.periodId;
    return (
      <Section>
        <SummaryList qa={`summary-period`}>
          <SummaryListItem
            validation={validation}
            label="Period"
            content={editor.data.periodId}
            qa={`period`}
            /*Put the action on the second item if not showing the first*/
            action={this.props.mode === "prepare" && <Link id={validation.key} replace={true} route={this.props.routes.monitoringReportPreparePeriod.getLink({projectId: this.props.projectId, id: this.props.id})}>Edit</Link>}
          />
        </SummaryList>
      </Section>
    );
  }

  private renderResponse(workflow: MonitoringReportWorkflow, editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>, question: MonitoringReportQuestionDto) {
    const response = question.options.find(x => x.id === question.optionId);
    const validation = editor && editor.validator.responses.results.find(x => x.model.displayOrder === question.displayOrder)!;
    return (
      <Section title={question.title}>
        <SummaryList qa={`summary-question-${question.displayOrder}`}>
          {this.renderScore(workflow, response, validation, question)}
          {this.renderComments(workflow, validation, question)}
        </SummaryList>
      </Section>
    );
  }
}

const Container = (props: MonitoringReportPrepareSummaryParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <DetailsComponent
          project={stores.projects.getById(props.projectId)}
          report={stores.monitoringReports.getById(props.projectId, props.id)}
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

export const MonitoringReportSummaryRoute = defineRoute({
  routeName: "monitoringReportSummary",
  routePath: "/projects/:projectId/monitoring-reports/:id/:mode<(view|prepare){1}>/summary",
  getParams: (r) => ({ projectId: r.params.projectId, id: r.params.id, mode: r.params.mode }),
  container: Container,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.MonitoringOfficer),
  getTitle: (store, params) => ({
    htmlTitle: params.mode === "view" ? "View monitoring report" : "Edit monitoring report",
    displayTitle: "Monitoring report"
  })
});
