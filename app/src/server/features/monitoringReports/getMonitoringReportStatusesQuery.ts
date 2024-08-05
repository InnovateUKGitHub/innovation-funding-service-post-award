import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { IContext } from "@framework/types/IContext";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { mapMonitoringReportStatus } from "./mapMonitoringReportStatus";

export class GetMonitoringReportStatusesQuery extends OptionsQueryBase<MonitoringReportStatus> {
  public readonly runnableName: string = "GetMonitoringReportStatusesQuery";
  constructor() {
    super("MonitoringReports");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.monitoringReportHeader.getMonitoringReportStatuses();
  }

  protected mapToEnumValue(value: string) {
    return mapMonitoringReportStatus(value);
  }
}
