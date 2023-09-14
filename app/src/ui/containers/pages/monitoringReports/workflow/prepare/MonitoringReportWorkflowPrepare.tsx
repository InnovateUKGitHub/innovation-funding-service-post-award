import { BaseProps } from "@ui/containers/containerBase";
import {
  MonitoringReportWorkflowData,
  MonitoringReportWorkflowParams,
  MonitoringReportWorkflowWorkflow,
} from "../MonitoringReportWorkflowProps";

const MonitoringReportWorkflowPrepare = (
  props: MonitoringReportWorkflowParams & MonitoringReportWorkflowWorkflow & MonitoringReportWorkflowData & BaseProps,
) => {
  const { workflow, report, mode } = props;

  const step = workflow.getCurrentStepInfo();
  if (!step?.stepRender) {
    throw new Error("There is no stepRender method");
  }
  return (
    <>
      {step &&
        step.stepRender({
          report,
          mode,
        })}
    </>
  );
};

export { MonitoringReportWorkflowPrepare };
