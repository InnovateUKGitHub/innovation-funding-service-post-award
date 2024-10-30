import { Section } from "@ui/components/atoms/Section/Section";
import { PeriodTitle } from "@ui/components/molecules/PeriodTitle/periodTitle";
import { MonitoringReportFormContext } from "./MonitoringReportWorkflow";
import { H2, H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { useContext, useEffect } from "react";
import { get } from "lodash";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { TextAreaField } from "@ui/components/molecules/form/TextFieldArea/TextAreaField";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { useContent } from "@ui/hooks/content.hook";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { FormTypes } from "@ui/zod/FormTypes";

const MonitoringReportQuestionStep = ({ questionNumber }: { questionNumber: number }) => {
  const { getContent } = useContent();
  const {
    report,
    mode,
    register,
    watch,
    handleSubmit,
    onUpdate,
    isFetching,
    validatorErrors,
    reset,
    registerButton,
    trigger,
  } = useContext(MonitoringReportFormContext);

  const i = report.questions.findIndex(x => x.displayOrder === questionNumber);
  const q = report.questions[i];

  const radioOptions = q.isScored
    ? (q.options || []).map(y => ({
        id: y.id,
        label: `${y.questionScore} - ${y.questionText}`,
        qa: `question-${q.displayOrder}-score-${y.questionScore}`,
      }))
    : [];

  const { resetState } = useFormRevalidate(watch, trigger);

  useEffect(() => {
    resetState();
    reset({
      addComments: report.addComments ?? "",
      questions: report.questions.map(x => ({
        optionId: x?.optionId ?? "",
        comments: x?.comments ?? "",
        title: x?.title ?? "",
      })),
      periodId: report.periodId,
      button_submit: "submit",
      form: FormTypes.MonitoringReportQuestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionNumber]);

  const commentFieldName: `questions.${number}.comments` = `questions.${q.displayOrder - 1}.comments`;
  const optionFieldName: `questions.${number}.optionId` = `questions.${q.displayOrder - 1}.optionId`;

  const disabledForm = mode === "view";
  const optionError = get(validatorErrors, optionFieldName) as RhfError;

  const serverRenderedCommentPreFillOnError = (get(validatorErrors, commentFieldName) as RhfError)?.originalData?.answer
    ?.comments;

  const defaultCommentValue = q?.comments || serverRenderedCommentPreFillOnError || undefined;

  return (
    <Section data-qa="period-information">
      <H2>
        <PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />
      </H2>
      <Section>
        <Form onSubmit={handleSubmit(data => onUpdate({ data }))} data-qa="monitoringReportQuestionForm">
          <input type="hidden" {...register("form")} value={FormTypes.MonitoringReportQuestion} />
          <H3>
            {getContent(x =>
              x.pages.monitoringReportsQuestionStep.counter({ current: i + 1, total: report.questions.length }),
            )}
          </H3>
          <input type="hidden" name="questionDisplayOrder" value={questionNumber} />
          <Fieldset>
            <Legend>{q.title}</Legend>
            <Hint id="hint-for-questions">{q.description}</Hint>
            {!!radioOptions.length && (
              <FormGroup hasError={!!optionError} id={optionFieldName}>
                <ValidationError error={optionError} data-qa="monitoring-report-option-error" />
                <RadioList name={`questions.${q.displayOrder - 1}.optionId`} id="questions" register={register}>
                  {radioOptions.map(option => (
                    <Radio
                      key={option.id}
                      id={option.id}
                      data-qa={option.qa}
                      label={option.label}
                      disabled={isFetching || disabledForm}
                      defaultChecked={option.id === q.optionId}
                    />
                  ))}
                </RadioList>
              </FormGroup>
            )}
          </Fieldset>

          <TextAreaField
            {...register(commentFieldName)}
            id={commentFieldName}
            label={getContent(x => x.pages.monitoringReportsQuestionStep.commentLabel)}
            disabled={isFetching || disabledForm}
            characterCount={watch(commentFieldName)?.length ?? 0}
            data-qa={commentFieldName}
            characterCountType="descending"
            characterCountMax={32_000}
            defaultValue={defaultCommentValue}
          />

          {mode === "prepare" && (
            <Fieldset data-qa="save-buttons">
              <Button type="submit" {...registerButton("saveAndContinue")} disabled={isFetching}>
                {getContent(x => x.pages.monitoringReportsQuestionStep.buttonContinue)}
              </Button>
              <Button secondary type="submit" {...registerButton("saveAndReturn")} disabled={isFetching}>
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
