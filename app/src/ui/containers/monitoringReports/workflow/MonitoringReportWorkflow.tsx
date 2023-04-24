import { Page, Projects } from "@ui/components";
import { BaseProps } from "@ui/containers/containerBase";
import { MonitoringReportWorkflowDef } from "@ui/containers/monitoringReports/workflow/monitoringReportWorkflowDef";
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
  const { project, editor, step, mode, report } = props;

  const workflow = MonitoringReportWorkflowDef.getWorkflow(report, step);

  return (
    <Page
      backLink={<MonitoringReportWorkflowBackLink {...props} workflow={workflow} />}
      pageTitle={<Projects.Title projectNumber={project.projectNumber} title={project.title} />}
      validator={workflow.getValidation(editor.validator)}
      error={editor.error}
    >
      {mode === "prepare" && !workflow.isOnSummary() ? (
        <MonitoringReportWorkflowPrepare {...props} workflow={workflow} />
      ) : (
        <MonitoringReportWorkflowView {...props} workflow={workflow} />
      )}
    </Page>
  );
};
