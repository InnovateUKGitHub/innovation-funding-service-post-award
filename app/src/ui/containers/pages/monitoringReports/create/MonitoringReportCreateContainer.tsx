import { Pending } from "@shared/pending";
import { PageLoader } from "@ui/components/bjss/loading";
import { BaseProps } from "@ui/containers/containerBase";
import { useStores } from "@ui/redux/storesProvider";
import { useNavigate } from "react-router-dom";
import { MonitoringReportCreate } from "./MonitoringReportCreate";
import { MonitoringReportCreateParams } from "./monitoringReportCreateDef";

const MonitoringReportCreateContainer = (props: MonitoringReportCreateParams & BaseProps) => {
  const stores = useStores();
  const navigate = useNavigate();

  const pending = Pending.combine({
    editor: stores.monitoringReports.getCreateMonitoringReportEditor(props.projectId),
  });

  return (
    <PageLoader
      pending={pending}
      render={({ editor }) => (
        <MonitoringReportCreate
          {...props}
          editor={editor}
          onChange={(save, dto, submit, getLink) => {
            stores.monitoringReports.updateMonitoringReportEditor(save, props.projectId, dto, submit, newDto => {
              if (getLink) {
                navigate(getLink(newDto.headerId).path);
              }
            });
          }}
        />
      )}
    />
  );
};

export { MonitoringReportCreateContainer };
