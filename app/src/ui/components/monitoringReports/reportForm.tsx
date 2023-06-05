import { IEditorStore } from "@ui/redux";
import * as Dtos from "@framework/dtos";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { SimpleString } from "@ui/components/renderers";
import { createTypedForm } from "@ui/components/form";
import { Section } from "../layout/section";
import { Content } from "../content";

interface PeriodProps {
  editor: IEditorStore<Dtos.MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: Dtos.MonitoringReportDto) => void;
  onSave: (dto: Dtos.MonitoringReportDto, submit: boolean, progress: boolean) => void;
}

const ReportForm = createTypedForm<Dtos.MonitoringReportDto>();

export const MonitoringReportPeriodFormComponent = ({ editor, onChange, onSave }: PeriodProps) => {
  return (
    <>
      <Section>
        <SimpleString>
          <Content value={x => x.components.reportForm.reportMessage} />
        </SimpleString>
        <SimpleString>
          <Content value={x => x.components.reportForm.questionScoreMessage} />
        </SimpleString>
      </Section>
      <Section>
        <ReportForm.Form editor={editor} onChange={dto => onChange(dto)} qa="monitoringReportCreateForm">
          <ReportForm.Numeric
            label="Period"
            labelBold
            width={3}
            name="period"
            value={x => x.periodId}
            update={(x, v) => (x.periodId = v as PeriodId)}
            validation={editor.validator.periodId}
          />
          <ReportForm.Fieldset qa="save-buttons">
            <ReportForm.Button name="save-continue" styling="Primary" onClick={() => onSave(editor.data, false, true)}>
              <Content value={x => x.components.reportForm.continueText} />
            </ReportForm.Button>
            <ReportForm.Button name="save-return" onClick={() => onSave(editor.data, false, false)}>
              <Content value={x => x.components.reportForm.saveAndReturnText} />
            </ReportForm.Button>
          </ReportForm.Fieldset>
        </ReportForm.Form>
      </Section>
    </>
  );
};
