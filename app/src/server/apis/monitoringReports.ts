import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetMonitoringReport } from "../features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";
import { processDto } from "../../shared/processResponse";
import { MonitoringReportDto, MonitoringReportSummaryDto } from "../../types/dtos/monitoringReportDto";
import { GetMonitoringReportsForProject } from "../features/monitoringReports/getMonitoringReportsForProject";

export interface IMonitoringReportsApi {
  get: (params: ApiParams<{ projectId: string, periodId: number }>) => Promise<MonitoringReportDto>;
  saveMonitoringReport: (params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) => Promise<MonitoringReportDto>;
  getAllForProject: (params: ApiParams<{projectId: string}>) => Promise<MonitoringReportSummaryDto[]>;
}

class Controller extends ControllerBaseWithSummary<MonitoringReportSummaryDto, MonitoringReportDto> implements IMonitoringReportsApi {
  constructor() {
    super("monitoring-reports");

    this.getItem("/:projectId/:periodId", (p) => ({ projectId: p.partnerId, periodId: parseInt(p.periodId, 10)}), (p) => this.get(p));
    this.putItem("/", (p, q, b) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true"}), (p) => this.saveMonitoringReport(p));
    this.getItems("/:projectId", (p) => ({ projectId: p.projectId }), (p) => this.getAllForProject(p));
  }

  public async get(params: ApiParams<{ projectId: string, periodId: number }>) {
    const {projectId, periodId} = params;
    const query = new GetMonitoringReport(projectId, periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveMonitoringReport(params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) {
    const {monitoringReportDto, submit} = params;
    const command = new SaveMonitoringReport(monitoringReportDto, submit);
    await contextProvider.start(params).runCommand(command);
    const query = new GetMonitoringReport(monitoringReportDto.projectId, monitoringReportDto.periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllForProject(params: ApiParams<{projectId: string}>) {
    const {projectId} = params;
    const query = new GetMonitoringReportsForProject(projectId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
