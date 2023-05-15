import { createTypedForm, PeriodTitle, Section, Content, Renderers } from "@ui/components";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { IEditorStore } from "@ui/redux";
import { H3 } from "@ui/components";

interface Props {
  questionNumber: number;
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  report: Pick<Dtos.MonitoringReportDto, "periodId" | "questions" | "startDate" | "endDate">;
  mode: "prepare" | "view";
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, progress: boolean) => void;
}

const ReportForm =
  createTypedForm<Pick<Dtos.MonitoringReportDto, "periodId" | "questions" | "startDate" | "endDate">>();

const MonitoringReportQuestionStep = ({ editor, questionNumber, onChange, onSave, report, mode }: Props) => {
  const title = (
    <PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />
  );

  const { validator } = editor;

  const i = editor.data.questions.findIndex(x => x.displayOrder === questionNumber);
  const q = editor.data.questions[i];
  const radioOptions = q.isScored
    ? (q.options || []).map(y => ({
        id: y.id,
        value: `${y.questionScore} - ${y.questionText}`,
        qa: `question-${q.displayOrder}-score-${y.questionScore}`,
      }))
    : [];

  return (
    <Section title={title} qa="period-information">
      <Section>
        <ReportForm.Form
          disabled={mode === "view"}
          editor={editor}
          onChange={dto => {
            return onChange(dto as Dtos.MonitoringReportDto);
          }}
          qa="monitoringReportQuestionForm"
        >
          <H3>
            <Content
              value={x =>
                x.pages.monitoringReportsQuestionStep.counter({ current: i + 1, total: report.questions.length })
              }
            />
          </H3>
          <ReportForm.Fieldset heading={q.title}>
            <Renderers.SimpleString className="govuk-hint">{q.description}</Renderers.SimpleString>
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
          {mode === "prepare" && (
            <ReportForm.Fieldset qa="save-buttons">
              <ReportForm.Button name="save-continue" styling="Primary" onClick={() => onSave(editor.data, true)}>
                <Content value={x => x.pages.monitoringReportsQuestionStep.buttonContinue} />
              </ReportForm.Button>
              <ReportForm.Button name="save-return" onClick={() => onSave(editor.data, false)}>
                <Content value={x => x.pages.monitoringReportsQuestionStep.buttonSaveAndReturn} />
              </ReportForm.Button>
            </ReportForm.Fieldset>
          )}
        </ReportForm.Form>
      </Section>
    </Section>
  );
};

export { MonitoringReportQuestionStep };
