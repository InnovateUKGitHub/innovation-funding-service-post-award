import { QueryBase } from "../common/queryBase";
import { IContext, MonitoringReportStatus } from "@framework/types";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { mapMonitoringReportStatus } from "./mapMonitoringReportStatus";

export class GetMonitoringReportStatusesQuery extends OptionsQueryBase<MonitoringReportStatus> {
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
