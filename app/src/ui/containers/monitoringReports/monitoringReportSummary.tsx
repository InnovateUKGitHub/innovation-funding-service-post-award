import React from "react";
import * as ACC from "../../components";
import * as Dtos from "@framework/types";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { MonitoringReportDtoValidator, QuestionValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { MonitoringReportReportSummaryProps } from "@ui/containers/monitoringReports/monitoringReportWorkflowDef";

interface InnerProps {
  statusChanges: Pending<Dtos.MonitoringReportStatusChangeDto[]>;
}

class Component extends React.Component<MonitoringReportReportSummaryProps & InnerProps> {

  public render() {
    const {mode, editor} = this.props;
    const title = <ACC.PeriodTitle periodId={editor.data.periodId} periodStartDate={editor.data.startDate} periodEndDate={editor.data.endDate} />;
    return (
      <ACC.Section title={title} qa="monitoringReportViewSection">
        {this.renderPeriod(editor)}
        {editor.data.questions.map(q => this.renderResponse(editor, q))}
        {this.renderLog()}
        { mode === "prepare" && this.renderForm(editor)}
      </ACC.Section>
    );
  }

  private renderLog() {
    return (
      <ACC.Section>
        <ACC.Accordion>
          <ACC.AccordionItem titleContent={x => x.monitoringReportsSummary.labels.statusAndCommentsLog()} qa="status-and-comments-log">
            {/* Keeping logs inside loader because accordion defaults to closed*/}
            <ACC.Loader
              pending={this.props.statusChanges}
              render={(statusChanges) => (
                <ACC.Logs data={statusChanges} qa="monitoring-report-status-change-table" />
              )}
            />
          </ACC.AccordionItem>
        </ACC.Accordion>
      </ACC.Section>
    );
  }

  private renderForm(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const ReportForm = ACC.TypedForm<Dtos.MonitoringReportDto>();
    return (
      <ACC.Section>
        <ReportForm.Form
          editor={editor}
          onChange={(dto) => this.props.onChange(dto)}
          qa="monitoringReportCreateForm"
        >
          <ReportForm.Fieldset qa="additional-comments-section" headingContent={x => x.monitoringReportsSummary.labels.additionalComments()}>
            <ReportForm.MultilineString
              hintContent={x => x.monitoringReportsSummary.messages.additionalCommentsGuidance()}
              name="addComments"
              value={() => editor.data.addComments}
              update={(dto, v) => dto.addComments = v || ""}
              qa="additional-comments-text-area"
            />
          </ReportForm.Fieldset>
          <ACC.Renderers.SimpleString><ACC.Content value={(x) => x.monitoringReportsSummary.messages.submittingMonitoringReportMessage()} /></ACC.Renderers.SimpleString>
          <ReportForm.Fieldset qa="save-buttons">
            <ReportForm.Button name="submit" styling="Primary" onClick={() => this.props.onSave(editor.data, true)}><ACC.Content value={(x) => x.monitoringReportsSummary.submitButton()} /></ReportForm.Button>
            <ReportForm.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(editor.data, false)}><ACC.Content value={(x) => x.monitoringReportsSummary.saveAndReturnButton()} /></ReportForm.Button>
          </ReportForm.Fieldset>
        </ReportForm.Form>
      </ACC.Section>
    );
  }

  private getAction(validation: QuestionValidator, question: Dtos.MonitoringReportQuestionDto) {
    if (this.props.mode !== "prepare") {
      return null;
    }
    return (
      <span id={validation.score.key}>
        <ACC.Link
          id={validation.comments.key}
          replace={true}
          route={this.props.getEditLink(`question-${question.displayOrder}`)}
        >
          <ACC.Content value={(x) => x.monitoringReportsSummary.editItemButton()} />
        </ACC.Link>
      </span>
    );
  }

  private renderScore(response: Dtos.MonitoringReportOptionDto | undefined, validation: QuestionValidator, question: Dtos.MonitoringReportQuestionDto) {
    if(!question.isScored) {
      return null;
    }
    return (
      <ACC.SummaryListItem
        validation={validation.score}
        label="Score"
        content={(response && `${response.questionScore} - ${response.questionText}`)}
        qa={`question-${question.displayOrder}-score`}
        action={this.getAction(validation, question)}
      />
    );
  }

  private renderComments(validation: QuestionValidator, question: Dtos.MonitoringReportQuestionDto) {
    return (
      <ACC.SummaryListItem
        validation={validation.comments}
        label="Comments"
        content={question.comments || ""}
        qa={`question-${question.displayOrder}-comments`}
        /*Put the action on the second item if not showing the first*/
        action={!question.isScored && this.getAction(validation, question)}
      />
    );
  }

  private renderPeriod(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>) {
    const validation = editor && editor.validator.periodId;
    return (
      <ACC.Section>
        <ACC.SummaryList qa={`summary-period`}>
          <ACC.SummaryListItem
            validation={validation}
            label="Period"
            content={editor.data.periodId}
            qa={`period`}
            /*Put the action on the second item if not showing the first*/
            action={this.props.mode === "prepare" && <ACC.Link id={validation.key} replace={true} route={this.props.routes.monitoringReportPreparePeriod.getLink({projectId: this.props.projectId, id: this.props.id})}><ACC.Content value={(x) => x.monitoringReportsSummary.editItemButton()} /></ACC.Link>}
          />
        </ACC.SummaryList>
      </ACC.Section>
    );
  }

  private renderResponse(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>, question: Dtos.MonitoringReportQuestionDto) {
    const response = question.options.find(x => x.id === question.optionId);
    const validation = editor && editor.validator.responses.results.find(x => x.model.displayOrder === question.displayOrder)!;
    return (
      <ACC.Section title={question.title}>
        <ACC.SummaryList qa={`summary-question-${question.displayOrder}`}>
          {this.renderScore(response, validation, question)}
          {this.renderComments(validation, question)}
        </ACC.SummaryList>
      </ACC.Section>
    );
  }
}

export const MonitoringReportSummary = (props: MonitoringReportReportSummaryProps) => (
  <StoresConsumer>
    {
      stores => (
        <Component
          statusChanges={stores.monitoringReports.getStatusChanges(props.projectId, props.id)}
          {...props}
        />
      )
    }
  </StoresConsumer>
);
