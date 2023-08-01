import { BaseProps } from "@ui/containers/containerBase";
import { MonitoringReportWorkflowDef } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflowDef";
import { useContent } from "@ui/hooks/content.hook";
import { MonitoringReportWorkflowBackLink } from "./MonitoringReportWorkflowBackLink";
import { MonitoringReportWorkflowParams } from "./MonitoringReportWorkflowProps";
import { MonitoringReportWorkflowPrepare } from "./prepare/MonitoringReportWorkflowPrepare";
import { MonitoringReportWorkflowView } from "./view/MonitoringReportWorkflowView";
import { BaseSyntheticEvent, createContext, useEffect, useState } from "react";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import {
  FormValues,
  useMonitoringReportWorkflowQuery,
  useOnMonitoringReportUpdateWorkflow,
} from "./monitoringReportWorkflow.logic";
import { UseFormHandleSubmit, UseFormRegister, UseFormWatch, useForm } from "react-hook-form";
import { noop } from "lodash";
import { useRhfErrors } from "@framework/util/errorHelpers";

export const MonitoringReportFormContext = createContext<{
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  isFetching: boolean;
  onUpdate: (data: FormValues, submitEvent?: BaseSyntheticEvent) => Promise<void>;
  validatorErrors: RhfErrors;
}>({
  register: noop as UseFormRegister<FormValues>,
  watch: noop as UseFormWatch<FormValues>,
  handleSubmit: noop as UseFormHandleSubmit<FormValues>,
  isFetching: false,
  onUpdate: noop as unknown as (data: FormValues, submitEvent?: BaseSyntheticEvent) => Promise<void>,
  validatorErrors: undefined,
});

export const MonitoringReportWorkflow = (props: MonitoringReportWorkflowParams & BaseProps) => {
  const [fetchKey, setFetchKey] = useState(0);

  const { project, report } = useMonitoringReportWorkflowQuery(props.projectId, props.id, fetchKey);
  const { getContent } = useContent();

  useEffect(() => {
    scrollToTheTopSmoothly();
  }, [props.step]);

  const workflow = MonitoringReportWorkflowDef.getWorkflow(report, props.step);
  const urlMode = props.mode;

  // If we are not in a draft/queried, the user theoretically cannot edit the content.
  const displayMode =
    report.status === MonitoringReportStatus.Draft || report.status === MonitoringReportStatus.Queried
      ? props.mode
      : "view";

  // If the mode in the URL and the mode we are displaying as don't match, display some guidance message.
  const displayUrlDiscrepancy = urlMode === "prepare" && displayMode === "view";

  const { register, watch, handleSubmit, formState } = useForm({
    defaultValues: { questions: report.questions.map(x => ({ optionId: x?.optionId, comments: x?.comments })) },
  });

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

  return (
    <MonitoringReportFormContext.Provider
      value={{ register, watch, handleSubmit, isFetching, onUpdate, validatorErrors }}
    >
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
          <MonitoringReportWorkflowView project={project} report={report} workflow={workflow} {...props} />
        )}
      </Page>
    </MonitoringReportFormContext.Provider>
  );
};
