import { useContext } from "react";
import { MonitoringReportFormContext } from "../MonitoringReportWorkflow";

const MonitoringReportWorkflowView = () => {
  const { workflow } = useContext(MonitoringReportFormContext);
  const summary = workflow.getSummary();
  if (!summary?.summaryRender) {
    throw new Error("monitoring report workflow missing a summaryRender method");
  }
  return <>{summary && summary.summaryRender()}</>;
};

export { MonitoringReportWorkflowView };
