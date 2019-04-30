import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetMonitoringReport, GetMonitoringReportById } from "../features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";
import { processDto } from "../../shared/processResponse";
import { GetMonitoringReportsForProject } from "../features/monitoringReports/getMonitoringReportsForProject";
import { MonitoringReportDto, MonitoringReportQuestionDto, MonitoringReportSummaryDto } from "../../types";
import { CreateMonitoringReport } from "@server/features/monitoringReports/createMonitoringReport";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";

export interface IMonitoringReportsApi {
  get: (params: ApiParams<{ projectId: string, id: string }>) => Promise<MonitoringReportDto>;
  saveMonitoringReport: (params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) => Promise<MonitoringReportDto>;
  createMonitoringReport: (params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) => Promise<MonitoringReportDto>;
  getAllForProject: (params: ApiParams<{ projectId: string }>) => Promise<MonitoringReportSummaryDto[]>;
  getActiveQuestions: (params: ApiParams<{}>) => Promise<MonitoringReportQuestionDto[]>;
}

class Controller extends ControllerBaseWithSummary<MonitoringReportSummaryDto, MonitoringReportDto> implements IMonitoringReportsApi {

  constructor() {
    super("monitoring-reports");

    this.getCustom("/questions", (p) => ({}), p => this.getActiveQuestions(p));
    this.getItem("/:projectId/:id", (p) => ({ projectId: p.projectId, id: p.id }), (p) => this.get(p));
    this.putItem("/", (p, q, b) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true" }), (p) => this.saveMonitoringReport(p));
    this.postItem("/", (p, q, b) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true" }), (p) => this.createMonitoringReport(p));
    this.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => this.getAllForProject(p));
  }

  public async get(params: ApiParams<{ projectId: string, id: string }>) {
    const { projectId, id } = params;
    const query = new GetMonitoringReportById(projectId, id);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveMonitoringReport(params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) {
    const { monitoringReportDto, submit } = params;
    const context = contextProvider.start(params);

    await context.runCommand(new SaveMonitoringReport(monitoringReportDto, submit));
    return context.runQuery(new GetMonitoringReport(monitoringReportDto.projectId, monitoringReportDto.periodId));
  }

  public async createMonitoringReport(params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) {
    const { monitoringReportDto, submit } = params;
    const context = contextProvider.start(params);

    const id = await context.runCommand(new CreateMonitoringReport(monitoringReportDto, submit));
    return context.runQuery(new GetMonitoringReportById(monitoringReportDto.projectId, id));
  }

  public async getAllForProject(params: ApiParams<{ projectId: string }>) {
    const { projectId } = params;
    const query = new GetMonitoringReportsForProject(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public getActiveQuestions(params: ApiParams<{}>) {
    return contextProvider.start(params).runQuery(new GetMonitoringReportActiveQuestions());
  }
}

export const controller = new Controller();
