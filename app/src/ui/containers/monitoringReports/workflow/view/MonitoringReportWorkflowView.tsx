import { MonitoringReportDto } from "@framework/dtos";
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
  const { workflow, editor, projectId, id, mode, onChange, routes } = props;
  const summary = workflow.getSummary();
  return (
    <>
      {summary &&
        summary.summaryRender({
          projectId,
          id,
          mode,
          editor,
          onChange: (dto: MonitoringReportDto) => onChange(false, dto),
          onSave: (dto: MonitoringReportDto, submit?: boolean) =>
            onChange(true, dto, submit, getForwardLink({ ...props, progress: false })),
          routes,
          // TODO type step name
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
