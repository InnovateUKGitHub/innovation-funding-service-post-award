import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components";
import { BaseProps } from "@ui/containers/containerBase";
import { useStores } from "@ui/redux";
import { useNavigate } from "react-router-dom";
import { MonitoringReportWorkflow } from "./MonitoringReportWorkflow";
import { MonitoringReportWorkflowParams } from "./MonitoringReportWorkflowProps";

export const MonitoringReportWorkflowContainer = (props: MonitoringReportWorkflowParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  const combined = Pending.combine({
    editor: stores.monitoringReports.getUpdateMonitoringReportEditor(props.projectId, props.id),
    project: stores.projects.getById(props.projectId),
  });

  return (
    <PageLoader
      pending={combined}
      render={({ project, editor }) => (
        <MonitoringReportWorkflow
          project={project}
          editor={editor}
          onChange={(save, dto, submit, link) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, () => {
              if (link) navigate(link.path);
            });
          }}
          {...props}
        />
      )}
    />
  );
};
