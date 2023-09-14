import { BaseProps } from "@ui/containers/containerBase";
import {
  MonitoringReportWorkflowData,
  MonitoringReportWorkflowParams,
  MonitoringReportWorkflowWorkflow,
} from "../MonitoringReportWorkflowProps";
import { MonitoringReportStatusChangeDto } from "@framework/dtos/monitoringReportDto";

const MonitoringReportWorkflowView = (
  props: MonitoringReportWorkflowParams &
    MonitoringReportWorkflowWorkflow &
    MonitoringReportWorkflowData &
    BaseProps & {
      statusChanges: Pick<
        MonitoringReportStatusChangeDto,
        "newStatusLabel" | "createdBy" | "createdDate" | "comments"
      >[];
    },
) => {
  const { workflow, projectId, id, mode, routes, report, statusChanges, ...rest } = props;
  const summary = workflow.getSummary();
  if (!summary?.summaryRender) {
    throw new Error("monitoring report workflow missing a summaryRender method");
  }
  return (
    <>
      {summary &&
        summary.summaryRender({
          projectId,
          id,
          mode,
          report,
          statusChanges,
          routes,
          getEditLink: (stepName: string) =>
            routes.monitoringReportWorkflow.getLink({
              projectId,
              id,
              mode,
              step: workflow.findStepNumberByName(stepName),
            }),
          ...rest,
        })}
    </>
  );
};

export { MonitoringReportWorkflowView };
