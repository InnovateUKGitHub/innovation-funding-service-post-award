import { useContext } from "react";
import { MonitoringReportFormContext } from "../MonitoringReportWorkflow";

const MonitoringReportWorkflowPrepare = () => {
  const { workflow } = useContext(MonitoringReportFormContext);

  const step = workflow.getCurrentStepInfo();
  if (!step?.stepRender) {
    throw new Error("There is no stepRender method");
  }
  return <>{step && step.stepRender()}</>;
};

export { MonitoringReportWorkflowPrepare };
