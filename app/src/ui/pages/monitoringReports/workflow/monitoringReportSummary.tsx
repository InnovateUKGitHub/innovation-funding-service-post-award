import { get } from "lodash";
import { useContext } from "react";
import { MonitoringReportOptionDto, MonitoringReportQuestionDto } from "@framework/dtos/monitoringReportDto";
import { Accordion } from "@ui/components/atoms/Accordion/Accordion";
import { AccordionItem } from "@ui/components/atoms/Accordion/AccordionItem";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/atoms/Section/Section";
import { H2, H3 } from "@ui/components/atoms/Heading/Heading.variants";
import { Link } from "@ui/components/atoms/Links/links";
import { Logs } from "@ui/components/molecules/Logs/logs";
import { PeriodTitle } from "@ui/components/molecules/PeriodTitle/periodTitle";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { MonitoringReportFormContext } from "./MonitoringReportWorkflow";
import { useContent } from "@ui/hooks/content.hook";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { TextAreaField } from "@ui/components/molecules/form/TextFieldArea/TextAreaField";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Button } from "@ui/components/atoms/form/Button/Button";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IRoutes } from "@ui/routing/routeConfig";
import { FormTypes } from "@ui/zod/FormTypes";

export const MonitoringReportSummary = () => {
  const {
    report,
    mode,
    id,
    projectId,
    validatorErrors: validationErrors,
    routes,
    getEditLink,
  } = useContext(MonitoringReportFormContext);

  return (
    <Section data-qa="monitoringReportViewSection">
      <H2>
        <PeriodTitle periodId={report.periodId} periodStartDate={report.startDate} periodEndDate={report.endDate} />
      </H2>
      <Period
        validationErrors={validationErrors}
        projectId={projectId}
        periodId={report.periodId}
        id={id}
        routes={routes}
        mode={mode}
      />
      {report.questions.map(question => (
        <Response
          validationErrors={validationErrors}
          key={question.displayOrder}
          question={question}
          mode={mode}
          getEditLink={getEditLink}
        />
      ))}
      <ReportLog />
      {mode === "prepare" && <ReportForm />}
    </Section>
  );
};

const ReportLog = () => {
  const { statusChanges } = useContext(MonitoringReportFormContext);
  return (
    <Section>
      <Accordion>
        <AccordionItem title={x => x.monitoringReportsLabels.statusAndCommentsLog} qa="status-and-comments-log">
          <Logs data={statusChanges} qa="monitoring-report-status-change-table" />
        </AccordionItem>
      </Accordion>
    </Section>
  );
};

const ReportForm = () => {
  const { register, watch, handleSubmit, onUpdate, isFetching, validatorErrors, registerButton, report } =
    useContext(MonitoringReportFormContext);
  const { getContent } = useContent();
  return (
    <Section>
      <Form data-qa="monitoringReportCreateForm" onSubmit={handleSubmit(data => onUpdate({ data }))}>
        <input type="hidden" {...register("form")} value={FormTypes.MonitoringReportSummary} />
        <Fieldset data-qa="additional-comments-section">
          <Legend>{getContent(x => x.monitoringReportsLabels.additionalComments)}</Legend>

          <TextAreaField
            {...register("addComments")}
            hint={getContent(x => x.monitoringReportsMessages.additionalCommentsGuidance)}
            id="add-comments"
            label={getContent(x => x.pages.monitoringReportsQuestionStep.commentLabel)}
            disabled={isFetching}
            error={validatorErrors?.addComments as RhfError}
            characterCount={watch("addComments")?.length ?? 0}
            characterCountMax={5000}
            data-qa="additional-comments-text-area"
            defaultValue={report.addComments ?? ""}
          />
        </Fieldset>
        <P>{getContent(x => x.monitoringReportsMessages.submittingMonitoringReportMessage)}</P>
        <Fieldset data-qa="save-buttons">
          <Button type="submit" disabled={isFetching} {...registerButton("submit")}>
            {getContent(x => x.pages.monitoringReportsSummary.buttonSubmit)}
          </Button>
          <Button type="submit" secondary disabled={isFetching} {...registerButton("saveAndReturnToSummary")}>
            {getContent(x => x.pages.monitoringReportsSummary.buttonSaveAndReturn)}
          </Button>
        </Fieldset>
      </Form>
    </Section>
  );
};

const Action = ({
  question,
  mode,
  getEditLink,
}: {
  question: MonitoringReportQuestionDto;
  mode: "prepare" | "view";
  getEditLink: (linkTo: string) => ILinkInfo;
}) => {
  if (mode !== "prepare") {
    return null;
  }
  return (
    <span>
      <Link replace route={getEditLink(`question-${question.displayOrder}`)}>
        <Content value={x => x.pages.monitoringReportsSummary.buttonEditItem} />
      </Link>
    </span>
  );
};

const Score = ({
  response,
  validation,
  question,
  mode,
  getEditLink,
  id,
}: {
  response: MonitoringReportOptionDto | undefined;
  validation: RhfError;
  question: MonitoringReportQuestionDto;
  mode: "prepare" | "view";
  getEditLink: (linkTo: string) => ILinkInfo;
  id: string;
}) => {
  if (!question.isScored) {
    return null;
  }
  return (
    <SummaryListItem
      hasError={!!validation}
      id={id}
      label={x => x.pages.monitoringReportsSummary.scoreLabel}
      content={response && `${response.questionScore} - ${response.questionText}`}
      qa={`question-${question.displayOrder}-score`}
      action={<Action question={question} mode={mode} getEditLink={getEditLink} />}
    />
  );
};

const Comments = ({
  validation,
  question,
  mode,
  getEditLink,
  id,
}: {
  validation: RhfError;
  question: MonitoringReportQuestionDto;
  mode: "prepare" | "view";
  getEditLink: (linkTo: string) => ILinkInfo;
  id: string;
}) => {
  return (
    <SummaryListItem
      id={id}
      hasError={!!validation}
      label={x => x.pages.monitoringReportsSummary.commentsLabel}
      content={question.comments || ""}
      qa={`questions-${question.displayOrder}-comments`}
      /* Put the action on the second item if not showing the first*/
      action={!question.isScored && <Action question={question} mode={mode} getEditLink={getEditLink} />}
      isMarkdown
    />
  );
};

const Period = ({
  validationErrors,
  projectId,
  periodId,
  mode,
  routes,
  id,
}: {
  routes: IRoutes;
  id: MonitoringReportId;
  mode: "prepare" | "view";
  periodId: PeriodId;
  projectId: ProjectId;
  validationErrors: RhfErrors;
}) => {
  return (
    <Section>
      <SummaryList qa="summary-period">
        <SummaryListItem
          id="periodId"
          hasError={!!validationErrors?.periodId}
          label={x => x.pages.monitoringReportsSummary.periodLabel}
          content={periodId}
          qa="period"
          /* Put the action on the second item if not showing the first*/
          action={
            mode === "prepare" && (
              <Link
                replace
                route={routes.monitoringReportPreparePeriod.getLink({
                  projectId,
                  id,
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
};

const Response = ({
  question,
  mode,
  getEditLink,
  validationErrors,
}: {
  question: MonitoringReportQuestionDto;
  mode: "prepare" | "view";
  getEditLink: (linkTo: string) => ILinkInfo;
  validationErrors: RhfErrors;
}) => {
  const response = question?.options?.find(x => x.id === question.optionId);

  const validation = get(validationErrors, `questions.${question.displayOrder - 1}`) as
    | { optionId?: RhfError; comments?: RhfError }
    | undefined;

  const id = `questions.${question.displayOrder - 1}.`;

  return (
    <Section>
      <H3>{question.title}</H3>
      <SummaryList qa={`summary-question-${question.displayOrder}`}>
        <Score
          id={`${id}optionId`}
          response={response}
          question={question}
          validation={validation?.optionId}
          mode={mode}
          getEditLink={getEditLink}
        />
        <Comments
          id={`${id}comments`}
          question={question}
          validation={validation?.comments}
          mode={mode}
          getEditLink={getEditLink}
        />
      </SummaryList>
    </Section>
  );
};
