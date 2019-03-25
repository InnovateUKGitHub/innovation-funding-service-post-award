import { dataStoreHelper } from "./common";
import { getKey } from "../../../util/key";

const monitoringReportStore = "monitoringReport";
export const getMonitoringReport = (projectId: string, periodId: number) => dataStoreHelper(monitoringReportStore, getKey(projectId, periodId));
