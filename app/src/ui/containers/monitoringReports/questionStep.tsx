import React from "react";
import * as ACC from "@ui/components";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { IEditorStore } from "@ui/redux";

interface Props {
  questionNumber: number;
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, progress: boolean) => void;
}

export class MonitoringReportQuestionStep extends React.Component<Props> {
  public render() {
    const {editor, questionNumber, onChange, onSave} = this.props;
    const questionIndex = editor.data.questions.findIndex(x => x.displayOrder === questionNumber);
    const ReportForm = ACC.TypedForm<Dtos.MonitoringReportDto>();
    const title = <ACC.PeriodTitle periodId={editor.data.periodId} periodStartDate={editor.data.startDate} periodEndDate={editor.data.endDate} />;

    return (
      <ACC.Section title={title} subtitle={`Question ${questionIndex + 1} of ${editor.data.questions.length}`}>
        <ACC.Section>
          <ReportForm.Form editor={editor} onChange={(dto) => onChange(dto)} qa="monitoringReportQuestionForm" >
            {this.renderFormItem(editor, questionNumber)}
            <ReportForm.Fieldset qa="save-buttons">
              <ReportForm.Button name="save-continue" styling="Primary" onClick={() => onSave(editor.data, true)}>Continue</ReportForm.Button>
              <ReportForm.Button name="save-return" onClick={() => onSave(editor.data, false)}>Save and return to summary</ReportForm.Button>
            </ReportForm.Fieldset>
          </ReportForm.Form>
        </ACC.Section>
      </ACC.Section>
    );
  }

  private renderFormItem(editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>, questionNumber: number) {
    const { data, validator } = editor;
    const ReportForm = ACC.TypedForm<Dtos.MonitoringReportDto>();

    const i = data.questions.findIndex(x => x.displayOrder === questionNumber);
    const q = data.questions[i];
    const radioOptions = q.isScored
      ? (q.options || []).map(y => ({ id: y.id, value: `${y.questionScore} - ${y.questionText}`, qa:`question-${q.displayOrder}-score-${y.questionScore}` }))
      : [];
    return (
      <ReportForm.Fieldset heading={q.title} >
        <ACC.Renderers.SimpleString className="govuk-hint">{q.description}</ACC.Renderers.SimpleString>
        <ReportForm.Hidden name={`questionDisplayOrder`} value={x => questionNumber} />
        { !!radioOptions.length && (
            <ReportForm.Radio
              name={`question_${q.displayOrder}_options`}
              label={``}
              inline={false}
              options={radioOptions}
              value={() => radioOptions.find(x => !!q.optionId && x.id === q.optionId)}
              update={(x, value) => x.questions[i].optionId = value && value.id}
              validation={validator.responses.results[i].score}
            />
          ) }
        <ReportForm.MultilineString
          name={`question_${q.displayOrder}_comments`}
          label="Comment"
          value={x => q.comments}
          update={(x, value) => { x.questions[i].comments = value; }}
          validation={validator.responses.results[i].comments}
        />
      </ReportForm.Fieldset>
    );
  }
}
