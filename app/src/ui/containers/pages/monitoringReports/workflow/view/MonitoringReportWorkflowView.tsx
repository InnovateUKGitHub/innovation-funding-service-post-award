import { BaseProps } from "@ui/containers/containerBase";
import {
  MonitoringReportWorkflowData,
  MonitoringReportWorkflowParams,
  MonitoringReportWorkflowWorkflow,
} from "../MonitoringReportWorkflowProps";

const MonitoringReportWorkflowView = (
  props: MonitoringReportWorkflowParams & MonitoringReportWorkflowWorkflow & MonitoringReportWorkflowData & BaseProps,
) => {
  const { workflow, projectId, id, mode, routes, report } = props;
  const summary = workflow.getSummary();
  return (
    <>
      {summary &&
        summary.summaryRender({
          projectId,
          id,
          mode,
          report,
          routes,
          getEditLink: (stepName: string) =>
            routes.monitoringReportWorkflow.getLink({
              projectId,
              id,
              mode,
              step: workflow.findStepNumberByName(stepName),
            }),
        })}
    </>
  );
};

export { MonitoringReportWorkflowView };
