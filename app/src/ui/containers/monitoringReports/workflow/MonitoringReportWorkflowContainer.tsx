import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components";
import { BaseProps } from "@ui/containers/containerBase";
import { useStores } from "@ui/redux";
import { useNavigate } from "react-router-dom";
import { MonitoringReportWorkflow } from "./MonitoringReportWorkflow";
import { MonitoringReportWorkflowParams } from "./MonitoringReportWorkflowProps";
import { useMonitoringReportWorkflowQuery } from "./monitoringReportWorkflow.logic";
import { useState } from "react";

export const MonitoringReportWorkflowContainer = (props: MonitoringReportWorkflowParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  const combined = Pending.combine({
    editor: stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id),
  });

  const [fetchKey, setFetchKey] = useState(0);

  const { project, report } = useMonitoringReportWorkflowQuery(props.projectId, props.id, fetchKey);

  return (
    <PageLoader
      pending={combined}
      render={({ editor }) => (
        <MonitoringReportWorkflow
          project={project}
          report={report}
          editor={editor}
          onChange={(save, dto, submit, link) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              setFetchKey(s => s + 1);
              if (link) navigate(link.path);
            });
          }}
          {...props}
        />
      )}
    />
  );
};
