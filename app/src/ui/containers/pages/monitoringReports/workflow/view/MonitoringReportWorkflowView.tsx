import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { BaseProps } from "@ui/containers/containerBase";
import { getForwardLink } from "../monitoringReportWorkflowDef";
import {
  MonitoringReportWorkflowCallbacks,
  MonitoringReportWorkflowData,
  MonitoringReportWorkflowParams,
  MonitoringReportWorkflowWorkflow,
} from "../MonitoringReportWorkflowProps";

const MonitoringReportWorkflowView = (
  props: MonitoringReportWorkflowParams &
    MonitoringReportWorkflowWorkflow &
    MonitoringReportWorkflowData &
    MonitoringReportWorkflowCallbacks &
    BaseProps,
) => {
  const { workflow, editor, projectId, id, mode, onChange, routes, report } = props;
  const summary = workflow.getSummary();
  return (
    <>
      {summary &&
        summary.summaryRender({
          projectId,
          id,
          mode,
          editor,
          report,
          onChange: (dto: MonitoringReportDto) => onChange(false, dto),
          onSave: (dto: MonitoringReportDto, submit?: boolean) =>
            onChange(true, dto, submit, getForwardLink({ ...props, progress: false })),
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
