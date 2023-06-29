import { BaseProps } from "@ui/containers/containerBase";
import { Fragment } from "react";
import { getForwardLink } from "../monitoringReportWorkflowDef";
import {
  MonitoringReportWorkflowCallbacks,
  MonitoringReportWorkflowData,
  MonitoringReportWorkflowParams,
  MonitoringReportWorkflowWorkflow,
} from "../MonitoringReportWorkflowProps";

const MonitoringReportWorkflowPrepare = (
  props: MonitoringReportWorkflowParams &
    MonitoringReportWorkflowWorkflow &
    MonitoringReportWorkflowData &
    MonitoringReportWorkflowCallbacks &
    BaseProps,
) => {
  const { workflow, editor, onChange, report, mode } = props;

  const step = workflow.getCurrentStepInfo();
  return (
    <Fragment>
      {step &&
        step.stepRender({
          editor,
          report,
          mode,
          onChange: dto => onChange(false, dto),
          onSave: (dto, progress) => onChange(true, dto, false, getForwardLink({ ...props, progress })),
        })}
    </Fragment>
  );
};

export { MonitoringReportWorkflowPrepare };
