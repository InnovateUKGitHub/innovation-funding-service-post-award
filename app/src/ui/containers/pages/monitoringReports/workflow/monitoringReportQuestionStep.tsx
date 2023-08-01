import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { Section } from "@ui/components/atomicDesign/atoms/form/Section/Section";
import { PeriodTitle } from "@ui/components/atomicDesign/molecules/PeriodTitle/periodTitle";
import { MonitoringReportFormContext } from "./MonitoringReportWorkflow";
import { H2, H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { useContext } from "react";
import { get } from "lodash";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { useContent } from "@ui/hooks/content.hook";

interface Props {
  questionNumber: number;
  report: Pick<MonitoringReportDto, "periodId" | "questions" | "startDate" | "endDate">;
  mode: "prepare" | "view";
}

const MonitoringReportQuestionStep = ({ questionNumber, report, mode }: Props) => {
  const { getContent } = useContent();

  const i = report.questions.findIndex(x => x.displayOrder === questionNumber);
  const q = report.questions[i];

  const radioOptions = q.isScored
    ? (q.options || []).map(y => ({
        id: y.id,
        label: `${y.questionScore} - ${y.questionText}`,
        qa: `question-${q.displayOrder}-score-${y.questionScore}`,
      }))
    : [];

  const { register, watch, handleSubmit, onUpdate, isFetching, validatorErrors } =
    useContext(MonitoringReportFormContext);

  const commentFieldName: `questions.${number}.comments` = `questions.${q.displayOrder - 1}.comments`;
  const commentFieldId = commentFieldName.replaceAll(".", "_");

  const disabledForm = mode === "view";

  return (
    <Section data-qa="period-information">
      <H2>
        <PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />
      </H2>
      <Section>
        <Form onSubmit={handleSubmit(onUpdate)} data-qa="monitoringReportQuestionForm">
          <H3>
            {getContent(x =>
              x.pages.monitoringReportsQuestionStep.counter({ current: i + 1, total: report.questions.length }),
            )}
          </H3>
          <input type="hidden" name="questionDisplayOrder" value={questionNumber} />
          <Fieldset>
            <Legend>{q.title}</Legend>
            <Hint id="hint-for-questions">{q.description}</Hint>
            {/* <ReportForm.Hidden name={"questionDisplayOrder"} value={() => questionNumber} /> */}

            {!!radioOptions.length && (
              <FormGroup>
                <RadioList name={`questions.${q.displayOrder - 1}.optionId`} id="questions" register={register}>
                  {radioOptions.map(option => (
                    <Radio
                      key={option.id}
                      id={option.id}
                      data-qa={option.qa}
                      label={option.label}
                      disabled={isFetching || disabledForm}
                      defaultValue={q?.optionId ?? ""}
                    />
                  ))}
                </RadioList>
              </FormGroup>
            )}
          </Fieldset>

          <TextAreaField
            {...register(commentFieldName)}
            id={commentFieldId}
            label={getContent(x => x.pages.monitoringReportsQuestionStep.commentLabel)}
            disabled={isFetching || disabledForm}
            error={get(validatorErrors, commentFieldName) as RhfError}
            characterCount={watch(commentFieldName)?.length ?? 0}
            data-qa={commentFieldId}
            characterCountType="ascending"
            defaultValue={q?.comments ?? ""}
          />

          {mode === "prepare" && (
            <Fieldset data-qa="save-buttons">
              <Button type="submit" name="button_save-continue" disabled={isFetching}>
                {getContent(x => x.pages.monitoringReportsQuestionStep.buttonContinue)}
              </Button>
              <Button secondary type="submit" name="button_save-return" disabled={isFetching}>
                {getContent(x => x.pages.monitoringReportsQuestionStep.buttonSaveAndReturn)}
              </Button>
            </Fieldset>
          )}
        </Form>
      </Section>
    </Section>
  );
};

export { MonitoringReportQuestionStep };
