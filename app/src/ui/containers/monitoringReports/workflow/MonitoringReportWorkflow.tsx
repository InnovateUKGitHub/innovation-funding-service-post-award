import { MonitoringReportStatus } from "@framework/constants";
import { Info, Page, Projects, ValidationMessage } from "@ui/components";
import { BaseProps } from "@ui/containers/containerBase";
import { MonitoringReportWorkflowDef } from "@ui/containers/monitoringReports/workflow/monitoringReportWorkflowDef";
import { useContent } from "@ui/hooks";
import { MonitoringReportWorkflowBackLink } from "./MonitoringReportWorkflowBackLink";
import {
  MonitoringReportWorkflowCallbacks,
  MonitoringReportWorkflowData,
  MonitoringReportWorkflowParams,
} from "./MonitoringReportWorkflowProps";
import { MonitoringReportWorkflowPrepare } from "./prepare/MonitoringReportWorkflowPrepare";
import { MonitoringReportWorkflowView } from "./view/MonitoringReportWorkflowView";

export const MonitoringReportWorkflow = (
  props: MonitoringReportWorkflowData & MonitoringReportWorkflowParams & MonitoringReportWorkflowCallbacks & BaseProps,
) => {
  const { project, editor, step, report } = props;
  const { getContent } = useContent();

  const workflow = MonitoringReportWorkflowDef.getWorkflow(report, step);
  const urlMode = props.mode;

  // If we are not in a draft/queried, the user theoretically cannot edit the content.
  const displayMode =
    report.status === MonitoringReportStatus.Draft || report.status === MonitoringReportStatus.Queried
      ? props.mode
      : "view";

  // If the mode in the URL and the mode we are displaying as don't match, display some guidance message.
  const displayUrlDiscrepancy = urlMode === "prepare" && displayMode === "view";

  return (
    <Page
      backLink={<MonitoringReportWorkflowBackLink {...props} workflow={workflow} />}
      pageTitle={<Projects.Title projectNumber={project.projectNumber} title={project.title} />}
      validator={editor.validator}
      error={editor.error}
    >
      {displayUrlDiscrepancy && (
        <ValidationMessage message={getContent(x => x.monitoringReportsMessages.readOnlyMessage)} messageType="info" />
      )}
      {!workflow.isOnSummary() ? (
        <MonitoringReportWorkflowPrepare {...props} workflow={workflow} mode={displayMode} />
      ) : (
        <MonitoringReportWorkflowView {...props} workflow={workflow} mode={displayMode} />
      )}
    </Page>
  );
};
