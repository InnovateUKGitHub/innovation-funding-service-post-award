import { BaseProps } from "@ui/containers/containerBase";
import { MonitoringReportWorkflowDef } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflowDef";
import { useContent } from "@ui/hooks/content.hook";
import { MonitoringReportWorkflowBackLink } from "./MonitoringReportWorkflowBackLink";
import {
  MonitoringReportWorkflowCallbacks,
  MonitoringReportWorkflowData,
  MonitoringReportWorkflowParams,
} from "./MonitoringReportWorkflowProps";
import { MonitoringReportWorkflowPrepare } from "./prepare/MonitoringReportWorkflowPrepare";
import { MonitoringReportWorkflowView } from "./view/MonitoringReportWorkflowView";
import { useEffect } from "react";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { Page } from "@ui/components/bjss/Page/page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";

export const MonitoringReportWorkflow = (
  props: MonitoringReportWorkflowData & MonitoringReportWorkflowParams & MonitoringReportWorkflowCallbacks & BaseProps,
) => {
  const { project, editor, step, report } = props;
  const { getContent } = useContent();

  useEffect(() => {
    scrollToTheTopSmoothly();
  }, [props.step]);

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
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
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