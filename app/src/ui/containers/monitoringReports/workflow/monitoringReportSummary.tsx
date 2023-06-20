import {
  MonitoringReportDto,
  MonitoringReportOptionDto,
  MonitoringReportQuestionDto,
  MonitoringReportStatusChangeDto,
} from "@framework/dtos/monitoringReportDto";
import { Pending } from "@shared/pending";
import { Accordion } from "@ui/components/accordion/Accordion";
import { AccordionItem } from "@ui/components/accordion/AccordionItem";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { Link } from "@ui/components/links";
import { Loader } from "@ui/components/loading";
import { Logs } from "@ui/components/logs";
import { PeriodTitle } from "@ui/components/periodTitle";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { MonitoringReportReportSummaryProps } from "@ui/containers/monitoringReports/workflow/monitoringReportWorkflowDef";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { MonitoringReportDtoValidator, QuestionValidator } from "@ui/validators/MonitoringReportDtoValidator";
import React from "react";

interface InnerProps {
  statusChanges: Pending<MonitoringReportStatusChangeDto[]>;
}

const ReportForm = createTypedForm<MonitoringReportDto>();

class MonitoringReportComponent extends React.Component<MonitoringReportReportSummaryProps & InnerProps> {
  public render() {
    const { mode, editor, report } = this.props;
    const title = (
      <PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />
    );
    return (
      <Section title={title} qa="monitoringReportViewSection">
        {this.renderPeriod(editor)}
        {report.questions.map(q => this.renderResponse(editor, q))}
        {this.renderLog()}
        {mode === "prepare" && this.renderForm(editor)}
      </Section>
    );
  }

  private renderLog() {
    return (
      <Section>
        <Accordion>
          <AccordionItem title={x => x.monitoringReportsLabels.statusAndCommentsLog} qa="status-and-comments-log">
            {/* Keeping logs inside loader because accordion defaults to closed*/}
            <Loader
              pending={this.props.statusChanges}
              render={statusChanges => <Logs data={statusChanges} qa="monitoring-report-status-change-table" />}
            />
          </AccordionItem>
        </Accordion>
      </Section>
    );
  }

  private renderForm(editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>) {
    return (
      <Section>
        <ReportForm.Form editor={editor} onChange={dto => this.props.onChange(dto)} qa="monitoringReportCreateForm">
          <ReportForm.Fieldset
            qa="additional-comments-section"
            heading={x => x.monitoringReportsLabels.additionalComments}
          >
            <ReportForm.MultilineString
              hint={x => x.monitoringReportsMessages.additionalCommentsGuidance}
              name="addComments"
              value={() => editor.data.addComments}
              update={(dto, v) => (dto.addComments = v || "")}
              qa="additional-comments-text-area"
              characterCountOptions={{ type: "descending", maxValue: 5000 }}
            />
          </ReportForm.Fieldset>
          <SimpleString>
            <Content value={x => x.monitoringReportsMessages.submittingMonitoringReportMessage} />
          </SimpleString>
          <ReportForm.Fieldset qa="save-buttons">
            <ReportForm.Button name="submit" styling="Primary" onClick={() => this.props.onSave(editor.data, true)}>
              <Content value={x => x.pages.monitoringReportsSummary.buttonSubmit} />
            </ReportForm.Button>
            <ReportForm.Button name="saveAndReturnToSummary" onClick={() => this.props.onSave(editor.data, false)}>
              <Content value={x => x.pages.monitoringReportsSummary.buttonSaveAndReturn} />
            </ReportForm.Button>
          </ReportForm.Fieldset>
        </ReportForm.Form>
      </Section>
    );
  }

  private getAction(validation: QuestionValidator, question: MonitoringReportQuestionDto) {
    if (this.props.mode !== "prepare") {
      return null;
    }
    return (
      <span id={validation.score.key}>
        <Link id={validation.comments.key} replace route={this.props.getEditLink(`question-${question.displayOrder}`)}>
          <Content value={x => x.pages.monitoringReportsSummary.buttonEditItem} />
        </Link>
      </span>
    );
  }

  private renderScore(
    response: MonitoringReportOptionDto | undefined,
    validation: QuestionValidator,
    question: MonitoringReportQuestionDto,
  ) {
    if (!question.isScored) {
      return null;
    }
    return (
      <SummaryListItem
        validation={validation?.score}
        label={x => x.pages.monitoringReportsSummary.scoreLabel}
        content={response && `${response.questionScore} - ${response.questionText}`}
        qa={`question-${question.displayOrder}-score`}
        action={this.getAction(validation, question)}
      />
    );
  }

  private renderComments(validation: QuestionValidator, question: MonitoringReportQuestionDto) {
    return (
      <SummaryListItem
        validation={validation.comments}
        label="Comments"
        content={question.comments || ""}
        qa={`question-${question.displayOrder}-comments`}
        /* Put the action on the second item if not showing the first*/
        action={!question.isScored && this.getAction(validation, question)}
        isMarkdown
      />
    );
  }

  private renderPeriod(editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>) {
    const validation = editor && editor.validator.periodId;
    return (
      <Section>
        <SummaryList qa={"summary-period"}>
          <SummaryListItem
            validation={validation}
            label={x => x.pages.monitoringReportsSummary.periodLabel}
            content={editor.data.periodId}
            qa={"period"}
            /* Put the action on the second item if not showing the first*/
            action={
              this.props.mode === "prepare" && (
                <Link
                  id={validation.key}
                  replace
                  route={this.props.routes.monitoringReportPreparePeriod.getLink({
                    projectId: this.props.projectId,
                    id: this.props.id,
                  })}
                >
                  <Content value={x => x.pages.monitoringReportsSummary.buttonEditItem} />
                </Link>
              )
            }
          />
        </SummaryList>
      </Section>
    );
  }

  private renderResponse(
    editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>,
    question: MonitoringReportQuestionDto,
  ) {
    const response = question.options.find(x => x.id === question.optionId);
    const validation =
      editor &&
      (editor.validator.responses.results.find(
        x => x.model.displayOrder === question.displayOrder,
      ) as QuestionValidator);
    return (
      <Section title={question.title} key={question.title}>
        <SummaryList qa={`summary-question-${question.displayOrder}`}>
          {this.renderScore(response, validation, question)}
          {this.renderComments(validation, question)}
        </SummaryList>
      </Section>
    );
  }
}

export const MonitoringReportSummary = (props: MonitoringReportReportSummaryProps) => {
  const stores = useStores();

  return (
    <MonitoringReportComponent
      {...props}
      statusChanges={stores.monitoringReports.getStatusChanges(props.projectId, props.id)}
    />
  );
};
