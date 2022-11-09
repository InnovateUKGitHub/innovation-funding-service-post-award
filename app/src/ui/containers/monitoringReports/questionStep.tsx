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

const ReportForm = ACC.createTypedForm<Dtos.MonitoringReportDto>();

const MonitoringReportQuestionStep = ({ editor, questionNumber, onChange, onSave }: Props) => {
  const title = (
    <ACC.PeriodTitle
      periodId={editor.data.periodId}
      periodStartDate={editor.data.startDate}
      periodEndDate={editor.data.endDate}
    />
  );

  const { data, validator } = editor;

  const i = data.questions.findIndex(x => x.displayOrder === questionNumber);
  const q = data.questions[i];
  const radioOptions = q.isScored
    ? (q.options || []).map(y => ({
        id: y.id,
        value: `${y.questionScore} - ${y.questionText}`,
        qa: `question-${q.displayOrder}-score-${y.questionScore}`,
      }))
    : [];

  return (
    <ACC.Section title={title} qa="period-information">
      <ACC.Section>
        <ReportForm.Form editor={editor} onChange={dto => onChange(dto)} qa="monitoringReportQuestionForm">
          <ReportForm.Fieldset heading={q.title}>
            <ACC.Renderers.SimpleString className="govuk-hint">{q.description}</ACC.Renderers.SimpleString>
            <ReportForm.Hidden name={"questionDisplayOrder"} value={() => questionNumber} />

            {!!radioOptions.length && (
              <ReportForm.Radio
                name={`question_${q.displayOrder}_options`}
                label=""
                inline={false}
                options={radioOptions}
                value={() => radioOptions.find(x => !!q.optionId && x.id === q.optionId)}
                update={(x, value) => (x.questions[i].optionId = value && value.id)}
                validation={validator.responses.results[i].score}
              />
            )}

            <ReportForm.MultilineString
              name={`question_${q.displayOrder}_comments`}
              label={x => x.pages.monitoringReportsQuestionStep.commentLabel}
              value={() => q.comments}
              update={(x, value) => {
                x.questions[i].comments = value;
              }}
              validation={validator.responses.results[i].comments}
            />
          </ReportForm.Fieldset>
          <ReportForm.Fieldset qa="save-buttons">
            <ReportForm.Button name="save-continue" styling="Primary" onClick={() => onSave(editor.data, true)}>
              <ACC.Content value={x => x.pages.monitoringReportsQuestionStep.buttonContinue} />
            </ReportForm.Button>
            <ReportForm.Button name="save-return" onClick={() => onSave(editor.data, false)}>
              <ACC.Content value={x => x.pages.monitoringReportsQuestionStep.buttonSaveAndReturn} />
            </ReportForm.Button>
          </ReportForm.Fieldset>
        </ReportForm.Form>
      </ACC.Section>
    </ACC.Section>
  );
};

export { MonitoringReportQuestionStep };
