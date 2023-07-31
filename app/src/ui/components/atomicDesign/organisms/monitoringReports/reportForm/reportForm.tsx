import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "../../../molecules/Section/section";
import { Content } from "../../../molecules/Content/content";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { useContent } from "@ui/hooks/content.hook";
import { Field } from "@ui/components/atomicDesign/molecules/form/Field/Field";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { FieldError, useForm } from "react-hook-form";

interface PeriodProps {
  editor: IEditorStore<MonitoringReportDto, MonitoringReportDtoValidator>;
  onChange: (dto: MonitoringReportDto) => void;
  onSave: (dto: MonitoringReportDto, submit: boolean, progress: boolean) => void;
}

const ReportForm = createTypedForm<MonitoringReportDto>();

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

type FormValues = {
  period: PeriodId;
};
export const RhfMonitoringReportPeriodFormComponent = ({ onUpdate }: { onUpdate: () => void }) => {
  const { getContent } = useContent();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      period: undefined,
    },
  });

  return (
    <>
      <Section>
        <P>{getContent(x => x.components.reportForm.reportMessage)}</P>
        <P>{getContent(x => x.components.reportForm.questionScoreMessage)}</P>
      </Section>
      <Section>
        <Form data-qa="monitoringReportCreateForm" onSubmit={handleSubmit(onUpdate)}>
          <Field labelBold label="Period" id="period" error={formState?.errors?.period as FieldError}>
            <NumberInput id="period" inputWidth={3} {...register("period")} />
          </Field>
          <Fieldset data-qa="save-buttons">
            <SubmitButton name="button_save-continue">
              {getContent(x => x.components.reportForm.continueText)}
            </SubmitButton>
            <SubmitButton secondary name="button_save-return">
              {getContent(x => x.components.reportForm.saveAndReturnText)}
            </SubmitButton>
          </Fieldset>
        </Form>
      </Section>
    </>
  );
};
