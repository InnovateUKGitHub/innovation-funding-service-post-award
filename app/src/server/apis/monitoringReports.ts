import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetMonitoringReport } from "../features/monitoringReports/getMonitoringReport";

export interface IMonitoringReportsApi {
  get: (params: ApiParams<{ projectId: string, periodId: number }>) => Promise<MonitoringReportDto>;
}

class Controller extends ControllerBase<MonitoringReportDto> implements IMonitoringReportsApi {
  constructor() {
    super("monitoring-reports");

    this.getItem("/:projectId/:periodId", (p) => ({ projectId: p.partnerId, periodId: parseInt(p.periodId, 10)}), (p) => this.get(p));
  }

  public async get(params: ApiParams<{ projectId: string, periodId: number }>) {
    const {projectId, periodId} = params;
    const query = new GetMonitoringReport(projectId, periodId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
