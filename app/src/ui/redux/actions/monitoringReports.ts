import { conditionalLoad } from "./common";
import { ApiClient } from "../../apiClient";
import { getMonitoringReport } from "../selectors/monitoringReports";

export function loadMonitoringReport(projectId: string, periodId: number) {
  return conditionalLoad(
    getMonitoringReport(projectId, periodId),
    params => ApiClient.monitoringReports.get({projectId, periodId, ...params})
  );
}
