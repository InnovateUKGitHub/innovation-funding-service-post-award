import { BaseProps } from "@ui/containers/containerBase";
import { MonitoringReportWorkflowDef } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflowDef";
import { useContent } from "@ui/hooks/content.hook";
import { MonitoringReportWorkflowBackLink } from "./MonitoringReportWorkflowBackLink";
import { MonitoringReportWorkflowParams } from "./MonitoringReportWorkflowProps";
import { MonitoringReportWorkflowPrepare } from "./prepare/MonitoringReportWorkflowPrepare";
import { MonitoringReportWorkflowView } from "./view/MonitoringReportWorkflowView";
import { createContext, useState } from "react";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { useScrollToTopSmoothly } from "@framework/util/windowHelpers";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import {
  FormValues,
  useMonitoringReportWorkflowQuery,
  useOnMonitoringReportUpdateWorkflow,
} from "./monitoringReportWorkflow.logic";
import { UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormWatch, useForm } from "react-hook-form";
import { noop } from "lodash";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { monitoringReportWorkflowErrorMap, monitoringReportWorkflowSchema } from "./monitoringReportWorkflow.zod";
import { monitoringReportSummaryErrorMap, monitoringReportSummarySchema } from "./monitoringReportSummary.zod";
import { RegisterButton, createRegisterButton } from "@framework/util/registerButton";

type MonitoringReportContextType = {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  isFetching: boolean;
  onUpdate: ({ data }: { data: FormValues }) => Promise<void>;
  validatorErrors: RhfErrors;
  registerButton: RegisterButton<FormValues>;
  reset: UseFormReset<FormValues>;
};

export const MonitoringReportFormContext = createContext<MonitoringReportContextType>({
  register: noop as UseFormRegister<FormValues>,
  watch: noop as UseFormWatch<FormValues>,
  handleSubmit: noop as UseFormHandleSubmit<FormValues>,
  isFetching: false,
  onUpdate: noop as unknown as ({ data }: { data: FormValues }) => Promise<void>,
  validatorErrors: undefined,
  registerButton: noop as RegisterButton<FormValues>,
  reset: noop as UseFormReset<FormValues>,
} as MonitoringReportContextType);

const getMonitoringReportSchema = (step?: number | null | undefined) =>
  typeof step == "number"
    ? { schema: monitoringReportWorkflowSchema, errorMap: monitoringReportWorkflowErrorMap }
    : { schema: monitoringReportSummarySchema, errorMap: monitoringReportSummaryErrorMap };

export const MonitoringReportWorkflow = (props: MonitoringReportWorkflowParams & BaseProps) => {
  /**
   * fetchKey is incremented and reset whenever a gql update is required
   */
  const [fetchKey, setFetchKey] = useState(0);

  const { project, report, statusChanges } = useMonitoringReportWorkflowQuery(props.projectId, props.id, fetchKey);
  const { getContent } = useContent();

  useScrollToTopSmoothly([props.step]);

  const workflow = MonitoringReportWorkflowDef.getWorkflow(report, props.step);
  const urlMode = props.mode;

  // If we are not in a draft/queried, the user theoretically cannot edit the content.
  const displayMode =
    report.status === MonitoringReportStatus.Draft || report.status === MonitoringReportStatus.Queried
      ? props.mode
      : "view";

  // If the mode in the URL and the mode we are displaying as don't match, display some guidance message.
  const displayUrlDiscrepancy = urlMode === "prepare" && displayMode === "view";

  const zodSchema = getMonitoringReportSchema(props.step);

  const { register, watch, handleSubmit, formState, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      addComments: report.addComments ?? "",
      questions: report.questions.map(x => ({
        optionId: x?.optionId ?? "",
        comments: x?.comments ?? "",
        title: x?.title ?? "",
      })),
      periodId: report.periodId,
      button_submit: "submit",
    },
    resolver: zodResolver(zodSchema.schema, { errorMap: zodSchema.errorMap }),
  });

  const registerButton = createRegisterButton(setValue, "button_submit");

  const { onUpdate, isFetching, apiError } = useOnMonitoringReportUpdateWorkflow(
    props.projectId,
    props.id,
    displayMode,
    report,
    workflow,
    props.routes,
    setFetchKey,
  );

  const validatorErrors = useRhfErrors<FormValues>(formState.errors);

  const MonitoringReportContextValues = {
    register,
    watch,
    handleSubmit,
    isFetching,
    onUpdate,
    validatorErrors,
    registerButton,
    reset,
  };

  return (
    <MonitoringReportFormContext.Provider value={MonitoringReportContextValues}>
      <Page
        backLink={<MonitoringReportWorkflowBackLink {...props} workflow={workflow} />}
        pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
        validationErrors={validatorErrors}
        apiError={apiError}
      >
        {displayUrlDiscrepancy && (
          <ValidationMessage
            message={getContent(x => x.monitoringReportsMessages.readOnlyMessage)}
            messageType="info"
          />
        )}
        {!workflow.isOnSummary() ? (
          <MonitoringReportWorkflowPrepare project={project} report={report} workflow={workflow} {...props} />
        ) : (
          <MonitoringReportWorkflowView
            project={project}
            report={report}
            workflow={workflow}
            statusChanges={statusChanges}
            {...props}
          />
        )}
      </Page>
    </MonitoringReportFormContext.Provider>
  );
};
